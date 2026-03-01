import { useState, useEffect } from "react";
import { T, FONT, GLOBAL_CSS } from "../../theme";
import { useMarketplaceStore } from "../store/useMarketplaceStore";
import { getHomeData } from "../api/engine";

// Components
import { SearchBar } from "../components/SearchBar";
import { VehicleSelectorModal } from "../components/VehicleSelectorModal";
import { ProductComparisonModal } from "../components/ProductComparisonModal";
import { ProductCard } from "../components/ProductCard";
import { ShopCard, SectionCarousel, SkeletonLoader, EmptyState } from "../components/SharedUI";

export function MarketplaceHome() {
  const { vehicle, setVehicleId } = useMarketplaceStore();
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  
  // UI Modals State
  const [vehModalOpen, setVehModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  // Fetch / Simulate API Call when Vehicle context changes
  useEffect(() => {
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      const resp = getHomeData(vehicle?.id);
      setData(resp);
      setLoading(false);
    }, 600);
  }, [vehicle]);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: FONT.ui, color: T.t1, paddingBottom: 60 }}>
      {/* GLOBAL CSS INJECTION (Since this is a sub-app, ensure styles exist) */}
      <style>{GLOBAL_CSS}</style>

      {/* TOP NAVIGATION */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", gap: 32 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <div style={{ width: 40, height: 40, background: `linear-gradient(135deg, ${T.amber}, ${T.amberDim})`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: "#000", boxShadow: `0 4px 16px ${T.amber}66` }}>
              ⚙️
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: T.t1, letterSpacing: "-0.02em" }}>Velvet Parts</div>
              <div style={{ fontSize: 10, color: T.t3, fontWeight: 700, letterSpacing: "0.1em" }}>MARKETPLACE</div>
            </div>
          </div>

          {/* Search Engine */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <SearchBar onSelectProduct={(p) => setActiveProduct(p)} />
          </div>

          {/* Right Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div 
              onClick={() => setVehModalOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: 8, background: vehicle ? `${T.emerald}22` : T.card, border: `1px solid ${vehicle ? T.emerald : T.border}`, padding: "8px 16px", borderRadius: 12, cursor: "pointer", transition: "all 0.2s" }}
              className="mp-card-hover"
            >
              <span style={{ fontSize: 18 }}>{vehicle ? (vehicle.type==="Car"?"🚙":"🏍️") : "🚘"}</span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 10, color: vehicle ? T.emerald : T.t3, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {vehicle ? "Vehicle Saved" : "Select Vehicle"}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: T.t1 }}>
                  {vehicle ? `${vehicle.brand} ${vehicle.model}` : "Add for exact fit"}
                </span>
              </div>
            </div>

            <button style={{ width: 42, height: 42, borderRadius: "50%", background: T.card, border: `1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize: 18, cursor:"pointer", position:"relative" }}>
              🛒
              <span style={{ position:"absolute", top:-2, right:-2, background:T.amber, color:"#000", width: 18, height: 18, borderRadius: "50%", fontSize: 10, fontWeight: 900, display:"flex", alignItems:"center", justifyContent:"center" }}>2</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            <div>
              <div style={{ width: 220, height: 28, background: T.border, borderRadius: 8, marginBottom: 20 }} className="pulse" />
              <SkeletonLoader type="product" count={5} />
            </div>
            <div>
              <div style={{ width: 180, height: 28, background: T.border, borderRadius: 8, marginBottom: 20 }} className="pulse" />
              <SkeletonLoader type="shop" count={5} />
            </div>
          </div>
        ) : (
          <>
            {/* VIEW A: VEHICLE SELECTED -> SHOW COMPATIBLE PARTS RANKED */}
            {vehicle && data?.compatibleParts ? (
              <div style={{ animation: "fadeUp 0.4s ease-out" }}>
                <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <h1 style={{ fontSize: 28, fontWeight: 900, color: T.t1, margin: "0 0 8px 0" }}>Parts for {vehicle.brand} {vehicle.model}</h1>
                    <div style={{ fontSize: 15, color: T.t3 }}>Showing {data.compatibleParts.length} verified compatible parts sorted by lowest price & nearest shops.</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, color: T.t2, cursor: "pointer" }}>Filter ⚙️</button>
                  </div>
                </div>

                {data.compatibleParts.length === 0 ? (
                  <EmptyState title="No parts found" desc="We currently don't have any parts explicitly listed for this vehicle model in your area." />
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
                    {data.compatibleParts.map(p => (
                      <ProductCard key={p.product.id} item={p} onClick={() => setActiveProduct(p)} />
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* VIEW B: NO VEHICLE SELECTED -> SHOW DYNAMIC MARKETPLACE */}
            {!vehicle && data ? (
              <div style={{ animation: "fadeUp 0.4s ease-out" }}>
                
                {/* Promo Banner */}
                <div style={{ width: "100%", height: 240, borderRadius: 20, background: `linear-gradient(135deg, ${T.surface}, #0f172a)`, border: `1px solid ${T.sky}44`, marginBottom: 48, display: "flex", alignItems: "center", padding: 40, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "relative", zIndex: 10, maxWidth: 500 }}>
                    <div style={{ display: "inline-block", background: `${T.amber}22`, color: T.amber, padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Welcome to Velvet Parts</div>
                    <h1 style={{ fontSize: 36, fontWeight: 900, color: "#fff", margin: "0 0 16px 0", lineHeight: 1.1 }}>Find the right part.<br/>From trusted local shops.</h1>
                    <button onClick={() => setVehModalOpen(true)} style={{ background: T.amber, color: "#000", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 15, fontWeight: 800, cursor: "pointer", transition: "all 0.2s" }} className="btn-hover-solid">
                      Select Your Vehicle 🚘
                    </button>
                  </div>
                  <div style={{ position:"absolute", right: -40, top: -40, fontSize: 240, opacity: 0.1 }}>⚙️</div>
                </div>

                {/* Popular Categories Mock */}
                <SectionCarousel title="Popular Categories">
                  {data.popularCategories.map(c => (
                    <div key={c} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "24px 32px", minWidth: 160, display:"flex", flexDirection:"column", alignItems:"center", gap: 12, cursor:"pointer" }} className="mp-card-hover">
                      <span style={{ fontSize: 32 }}>{c==="Brakes"?"🛑":c==="Engine"?"⚙️":c==="Filters"?"💨":c==="Electrical"?"⚡":c==="Suspension"?"🛞":"🔧"}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: T.t1 }}>{c}</span>
                    </div>
                  ))}
                </SectionCarousel>

                {/* Top Selling Overall */}
                <SectionCarousel title="🔥 Global Top Selling Parts">
                  {data.topSelling.map(p => (
                    <ProductCard key={p.product.id} item={p} onClick={() => setActiveProduct(p)} />
                  ))}
                </SectionCarousel>

                {/* Best Deals */}
                {data.bestDeals.length > 0 && (
                  <SectionCarousel title="💰 Best Deals Today">
                    {data.bestDeals.map(p => (
                      <ProductCard key={p.product.id} item={p} onClick={() => setActiveProduct(p)} />
                    ))}
                  </SectionCarousel>
                )}

                {/* Trending Local */}
                <SectionCarousel title="⚡ Trending Near You">
                  {data.trendingNearYou.map(p => (
                    <ProductCard key={p.product.id} item={p} onClick={() => setActiveProduct(p)} />
                  ))}
                </SectionCarousel>

                {/* Nearby Shops Preview */}
                <SectionCarousel title="🏪 Trusted Shops Near You">
                  {data.trendingNearYou.filter((v,i,a)=>a.findIndex(t=>(t.listings[0].shop_id === v.listings[0].shop_id))===i).map(p => (
                    <ShopCard key={p.listings[0].shop_id} shop={p.listings[0].shop} />
                  ))}
                </SectionCarousel>

              </div>
            ) : null}
          </>
        )}
      </div>

      {/* MODALS */}
      <VehicleSelectorModal open={vehModalOpen} onClose={() => setVehModalOpen(false)} />
      <ProductComparisonModal open={!!activeProduct} productData={activeProduct} onClose={() => setActiveProduct(null)} />
    </div>
  );
}
