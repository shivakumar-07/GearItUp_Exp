import { T, FONT } from "../../theme";
import { fmt } from "../../utils";

export function ProductComparisonModal({ open, onClose, productData }) {
  if (!open || !productData) return null;
  const { product, listings, isCompatible } = productData;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", animation: "fade 0.2s" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }} onClick={onClose} />
      
      <div style={{ position: "relative", background: T.surface, width: 720, borderRadius: 20, boxShadow: "0 24px 60px rgba(0,0,0,0.5)", border: `1px solid ${T.border}`, overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
        
        {/* Header Details */}
        <div style={{ padding: 24, borderBottom: `1px solid ${T.border}`, background: T.card, display: "flex", gap: 20 }}>
          <div style={{ width: 120, height: 120, borderRadius: 12, background: T.bg, flexShrink: 0, overflow: "hidden", border:`1px solid ${T.border}` }}>
            {product.image ? <img src={product.image} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : null}
          </div>
          
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontSize: 12, color: T.t3, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{product.brand} · {product.category}</div>
              <button onClick={onClose} style={{ background:"transparent", border:"none", color:T.t3, fontSize: 24, cursor:"pointer" }}>✕</button>
            </div>
            
            <div style={{ fontSize: 22, fontWeight: 800, color: T.t1, lineHeight: 1.2, marginTop: 4 }}>{product.name}</div>
            <div style={{ fontSize: 13, color: T.t2, marginTop: 8, lineHeight: 1.5, display:"-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.description}</div>
            
            <div style={{ display:"flex", gap:10, marginTop: "auto", paddingTop: 12 }}>
              {isCompatible ? (
                <span style={{ background:`${T.emerald}22`, color:T.emerald, padding:"4px 10px", borderRadius:6, fontSize:11, fontWeight:800, fontFamily:FONT.ui }}>✓ EXACT FIT FOR YOUR VEHICLE</span>
              ) : (
                <span style={{ background:T.bg, color:T.t3, padding:"4px 10px", borderRadius:6, fontSize:11, fontWeight:700, fontFamily:FONT.ui, border: `1px solid ${T.border}` }}>SKU: {product.sku}</span>
              )}
            </div>
          </div>
        </div>

        {/* Comparison List */}
        <div style={{ padding: "16px 24px", background: T.bg, flex: 1, overflowY: "auto" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: T.t1, marginBottom: 16 }}>Available at {listings.length} Shops Near You</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {listings.map((list, i) => (
              <div key={list.shop_id} style={{ background: T.card, border: `1px solid ${i===0 ? T.amber : T.border}`, borderRadius: 12, padding: 16, display:"flex", alignItems:"center", gap: 16, position:"relative", overflow:"hidden" }}>
                {i === 0 && <div style={{ position:"absolute", top:0, right:32, background:T.amber, color:"#000", padding:"2px 10px", borderBottomLeftRadius:8, borderBottomRightRadius:8, fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.05em" }}>Top Pick</div>}
                
                {/* Shop Block */}
                <div style={{ flex: 1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap: 8 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: T.t1 }}>{list.shop.name}</div>
                    {list.shop.is_featured && <span style={{ fontSize:10, color:T.amber }}>★</span>}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap: 12, fontSize: 12, color: T.t3, marginTop: 4 }}>
                    <span style={{ color: T.amber }}>⭐ {list.shop.rating.toFixed(1)}</span>
                    <span>📍 {list.distance} km away</span>
                  </div>
                </div>

                {/* Logistics */}
                <div style={{ width: 120 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: list.stock_quantity > list.min_stock ? T.emerald : T.amber }}>
                    {list.stock_quantity > list.min_stock ? "In Stock" : `Only ${list.stock_quantity} left`}
                  </div>
                  <div style={{ fontSize: 11, color: T.t3, marginTop: 2 }}>{list.delivery_time}</div>
                </div>

                {/* Price & Action */}
                <div style={{ textAlign: "right", paddingLeft: 16, borderLeft: `1px solid ${T.border}` }}>
                  {list.discount > 0 && <div style={{ fontSize: 12, color: T.t3, textDecoration: "line-through" }}>{fmt(list.selling_price / (1 - list.discount/100))}</div>}
                  <div style={{ fontSize: 20, fontWeight: 900, color: T.sky, fontFamily: FONT.mono }}>{fmt(list.selling_price)}</div>
                  <button style={{ background: T.emeraldBg, color: T.emerald, border: `1px solid ${T.emerald}44`, borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 800, cursor: "pointer", marginTop: 8, transition:"all 0.15s" }} className="btn-hover-solid">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
