import { T, FONT } from "../../theme";
import { fmt } from "../../utils";

export function ProductCard({ item, onClick }) {
    const { product, bestPrice, availability, shopCount, fastestEta, rankScore } = item;

    // Stock Indicator Color logic
    let stockColor = T.emerald;
    let stockLabel = "In Stock";
    if (availability === 0) { stockColor = T.crimson; stockLabel = "Out of Stock"; }
    else if (availability < 5) { stockColor = T.amber; stockLabel = "Low Stock"; }

    return (
        <div
            onClick={onClick}
            style={{
                background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: 16,
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                position: "relative",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                width: 260,
                flexShrink: 0
            }}
            className="mp-card-hover" // We will add a global CSS hover effect for this later
        >
            {/* Top badges */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ background: `${stockColor}22`, color: stockColor, padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 800, fontFamily: FONT.ui, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {stockLabel}
                </div>
                <div style={{ background: T.surface, border: `1px solid ${T.border}`, padding: "3px 6px", borderRadius: 6, fontSize: 10, color: T.t3, fontFamily: FONT.mono, fontWeight: 700 }}>
                    {shopCount} {shopCount === 1 ? "Shop" : "Shops"}
                </div>
            </div>

            {/* Image Mock (We use background color block since real images might not load in isolated env, but we pass URL if provided) */}
            <div style={{ width: "100%", height: 140, borderRadius: 12, background: T.surface, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {product.image ? (
                    <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                    <span style={{ fontSize: 48, opacity: 0.5 }}>📦</span>
                )}
            </div>

            {/* Product Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                <div style={{ fontSize: 11, color: T.t3, fontFamily: FONT.ui, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>{product.brand}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.t1, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {product.name}
                </div>
                <div style={{ fontSize: 12, color: T.t4, fontFamily: FONT.mono, marginTop: "auto" }}>
                    ETA: <span style={{ color: T.t2, fontWeight: 600 }}>{fastestEta}</span>
                </div>
            </div>

            {/* Pricing / Action */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4, paddingTop: 12, borderTop: `1px dashed ${T.border}` }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: T.sky, fontFamily: FONT.mono }}>
                    {fmt(bestPrice)}
                </div>
                <div style={{ background: T.sky, color: "#000", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 800, fontFamily: FONT.ui, transition: "all 0.15s" }}>
                    View Shops
                </div>
            </div>
        </div>
    );
}
