import { useState, useCallback } from "react";
import { T, FONT, GLOBAL_CSS } from "./theme";
import { fmt } from "./utils";
import { useStore } from "./store";
import { Toast, useToast, Btn } from "./components/ui";

// Modals
import { ProductModal } from "./components/ProductModal";

// Pages
import { DashboardPage } from "./pages/DashboardPage";
import { InventoryPage } from "./pages/InventoryPage";
import { HistoryPage } from "./pages/HistoryPage";
import { OrdersPage } from "./pages/OrdersPage";

// NEW USER MARKETPLACE ENTRY POINT
import { MarketplaceHome } from "./marketplace/pages/MarketplaceHome";

const NAV_ITEMS = [
  { key:"dashboard", icon:"◈", label:"Dashboard"     },
  { key:"inventory", icon:"⬡", label:"Inventory"     },
  { key:"history",   icon:"⊞", label:"History"       },
  { key:"orders",    icon:"◎", label:"Orders"        },
];

export default function App() {
  const { products, movements, saveProducts, saveMovements, loaded } = useStore();
  const [page, setPage]       = useState("dashboard");
  const [pModal, setPModal]   = useState({ open:false, product:null });
  const { items:toasts, add:toast, remove:removeToast } = useToast();

  // APP MODE TOGGLE STATE
  const [appMode, setAppMode] = useState("marketplace"); // 'marketplace' or 'shopOwner'

  const saveProduct = useCallback((p)=>{
    const exists = products.find(x=>x.id===p.id);
    saveProducts(exists ? products.map(x=>x.id===p.id?p:x) : [...products,p]);
  },[products,saveProducts]);

  const handleSale = useCallback((data)=>{
    const updated = products.map(p=>p.id===data.productId ? {...p, stock: Math.max(0,p.stock-data.qty)} : p);
    saveProducts(updated);
    const sel = products.find(p=>p.id===data.productId);
    const uid = () => Math.random().toString(36).slice(2, 10);
    saveMovements([...movements, {
      id:"m"+uid(), productId:data.productId, productName:sel?.name||"", type:"SALE",
      qty:data.qty, unitPrice:data.sellPrice, sellingPrice:data.sellPrice,
      total:data.total, gstAmount:data.gstAmount, profit:data.profit,
      discount:data.discount,
      customerName:data.customerName, customerPhone:data.customerPhone,
      vehicleReg:data.vehicleReg, mechanic:data.mechanic,
      supplier:null, invoiceNo:data.invoiceNo, payment:data.payment,
      creditDays:0, paymentStatus:"paid",
      note: [data.customerName&&`Customer: ${data.customerName}`, data.vehicleReg&&`Vehicle: ${data.vehicleReg}`, data.notes].filter(Boolean).join(" · ") || "Walk-in sale",
      date:data.date,
    }]);
    toast(`Sale recorded: ${data.qty}×${sel?.name?.slice(0,20)||"product"} · ${fmt(data.total)}`, "success", "Sale Complete");
  },[products,movements,saveProducts,saveMovements,toast]);

  const handlePurchase = useCallback((data)=>{
    const updated = products.map(p=>p.id===data.productId ? {
      ...p,
      stock:p.stock+data.qty,
      buyPrice:data.buyPrice,
      sellPrice:data.newSellPrice||p.sellPrice,
      supplier:data.supplier||p.supplier,
    } : p);
    saveProducts(updated);
    const sel = products.find(p=>p.id===data.productId);
    const uid = () => Math.random().toString(36).slice(2, 10);
    saveMovements([...movements, {
      id:"m"+uid(), productId:data.productId, productName:sel?.name||"", type:"PURCHASE",
      qty:data.qty, unitPrice:data.buyPrice, sellingPrice:data.newSellPrice||sel?.sellPrice,
      total:data.total, gstAmount:data.gstAmount, profit:null,
      supplier:data.supplier, invoiceNo:data.invoiceNo,
      payment:data.payment, creditDays:data.creditDays,
      paymentStatus:data.payment==="Credit"?"pending":"paid",
      note:[data.supplier&&`Supplier: ${data.supplier}`, data.payment==="Credit"&&`Credit ${data.creditDays}d`, data.notes].filter(Boolean).join(" · ")||"Stock purchase",
      date:data.date,
    }]);
    toast(`Stock added: +${data.qty} units · ${fmt(data.total)}`, "info", "Purchase Recorded");
  },[products,movements,saveProducts,saveMovements,toast]);

  if (!loaded||!products||!movements) return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT.ui }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:42, animation:"pulse 1.5s infinite", marginBottom:16 }}>⚙️</div>
        <div style={{ color:T.t3, fontSize:14 }}>Loading Velvet System…</div>
      </div>
    </div>
  );

  // ----------------------------------------------------
  // ROUTING RENDER LOGIC
  // ----------------------------------------------------
  if (appMode === "marketplace") {
    return (
      <>
        <MarketplaceHome />
        {/* DEV SYSTEM TOGGLE FLOATING BUTTON */}
        <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 99999 }}>
          <button onClick={() => setAppMode("shopOwner")} style={{ background: "#4F46E5", color: "#fff", border: "none", borderRadius: 30, padding: "12px 20px", fontSize: 13, fontWeight: 800, cursor: "pointer", display:"flex", alignItems:"center", gap: 8, boxShadow: "0 10px 40px rgba(79, 70, 229, 0.4)" }}>
            🔄 Switch to Shop Owner View
          </button>
        </div>
      </>
    );
  }

  // SHOP OWNER DASHBOARD RENDER LOGIC
  const todaySales = movements.filter(m=>m.type==="SALE"&&m.date>=Date.now()-86400000);
  const todayRev   = todaySales.reduce((s,m)=>s+m.total,0);
  
  const stockStatus = p => {
    if (p.stock<=0)           return "out";
    if (p.stock<p.minStock)   return "low";
    return "ok";
  };
  const lowCount = products.filter(p=>stockStatus(p)!=="ok").length;

  const renderPage = () => {
    if(page==="dashboard") return <DashboardPage products={products} movements={movements} onNavigate={setPage} />;
    if(page==="inventory") return <InventoryPage products={products} movements={movements} onAdd={()=>setPModal({open:true,product:null})} onEdit={p=>setPModal({open:true,product:p})} onSale={handleSale} onPurchase={handlePurchase} toast={toast} />;
    if(page==="history")   return <HistoryPage movements={movements} />;
    if(page==="orders")    return <OrdersPage products={products} onSale={handleSale} toast={toast} />;
  };

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:FONT.ui, color:T.t1 }}>
      <style>{GLOBAL_CSS}</style>

      {/* TOPBAR */}
      <div style={{ height:56, background:T.surface, borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", padding:"0 20px", position:"sticky", top:0, zIndex:500, gap:10 }}>
        {/* Brand */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginRight:12 }}>
          <div style={{ width:36, height:36, background:`linear-gradient(135deg,${T.amber},${T.amberDim})`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:900, color:"#000", boxShadow:`0 2px 12px ${T.amber}55`, letterSpacing:"-0.05em" }}>R</div>
          <div>
            <div style={{ fontSize:14, fontWeight:800, color:T.t1, letterSpacing:"-0.02em" }}>Ravi Auto Parts</div>
            <div style={{ fontSize:10, color:T.amber, fontWeight:600, letterSpacing:"0.04em" }}>INVENTORY · HYDERABAD</div>
          </div>
        </div>

        {/* NAV */}
        <div style={{ display:"flex", gap:2 }}>
          {NAV_ITEMS.map(n=>(
            <button key={n.key} className={`nav-item${page===n.key?" nav-active":""}`} onClick={()=>setPage(n.key)}
              style={{ background:page===n.key?T.amberGlow:"transparent", color:page===n.key?T.amber:T.t2, border:`1px solid ${page===n.key?T.amber+"44":"transparent"}`, borderRadius:8, padding:"7px 14px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:FONT.ui, display:"flex", alignItems:"center", gap:7 }}>
              <span style={{ fontSize:15 }}>{n.icon}</span>{n.label}
              {n.key==="orders"&&<span style={{ background:T.crimson, color:"#fff", fontSize:10, borderRadius:"50%", width:16, height:16, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800 }}>2</span>}
            </button>
          ))}
        </div>

        <div style={{ flex:1 }}/>

        {/* Quick stats */}
        {todayRev>0 && (
          <div style={{ background:T.emeraldBg, border:`1px solid ${T.emerald}33`, borderRadius:8, padding:"5px 12px", fontSize:12, color:T.emerald, fontWeight:700, fontFamily:FONT.mono, display:"flex", alignItems:"center", gap:6 }}>
            📈 Today: {fmt(todayRev)}
          </div>
        )}
        {lowCount>0 && (
          <button onClick={()=>setPage("inventory")} style={{ background:T.crimsonBg, border:`1px solid ${T.crimson}33`, borderRadius:8, padding:"5px 12px", fontSize:12, color:T.crimson, fontWeight:700, cursor:"pointer", fontFamily:FONT.ui, display:"flex", alignItems:"center", gap:5 }}>
            ⚠ {lowCount} alert{lowCount>1?"s":""}
          </button>
        )}

        <Btn size="sm" variant="ghost" onClick={()=>{ setPage("inventory"); }} style={{ borderColor:T.border }}>📤 Sale</Btn>
        <Btn size="sm" variant="amber" onClick={()=>setPModal({open:true,product:null})}>＋ Product</Btn>

        {/* Avatar */}
        <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg,${T.amber},${T.amberDim})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, color:"#000", fontWeight:900, marginLeft:4 }}>R</div>
      </div>

      {/* PAGE CONTENT */}
      <div style={{ padding:"24px 28px", maxWidth:1440, margin:"0 auto" }}>
        {renderPage()}
      </div>

      {/* MODALS */}
      <ProductModal
        open={pModal.open} product={pModal.product}
        onClose={()=>setPModal({open:false,product:null})}
        onSave={saveProduct} toast={toast}
      />

      {/* TOASTS */}
      <Toast items={toasts} onRemove={removeToast} />

      {/* DEV SYSTEM TOGGLE FLOATING BUTTON */}
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 99999 }}>
        <button onClick={() => setAppMode("marketplace")} style={{ background: "#4F46E5", color: "#fff", border: "none", borderRadius: 30, padding: "12px 20px", fontSize: 13, fontWeight: 800, cursor: "pointer", display:"flex", alignItems:"center", gap: 8, boxShadow: "0 10px 40px rgba(79, 70, 229, 0.4)" }}>
          🔄 Switch to User Marketplace
        </button>
      </div>

    </div>
  );
}
