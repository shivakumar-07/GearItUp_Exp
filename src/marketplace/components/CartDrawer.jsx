import { useMemo } from "react";
import { T, FONT } from "../../theme";
import { useStore } from "../../store";
import { fmt } from "../../utils";

const DELIVERY_OPTIONS = [
    { id: "express", label: "Express", desc: "~45 min", fee: 59, icon: "⚡" },
    { id: "standard", label: "Standard", desc: "2-4 hrs", fee: 29, icon: "🚚" },
];

export function CartDrawer({ onCheckout }) {
    const { cart, saveCart, isCartOpen, setIsCartOpen } = useStore();

    const safeCart = cart || [];

    // Group cart items by shop (Swiggy-style vendor splitting)
    const cartByShop = useMemo(() => {
        return safeCart.reduce((acc, item) => {
            const shopId = item.listing?.shop_id;
            if (!shopId) return acc;
            if (!acc[shopId]) {
                acc[shopId] = { shopId, shop: item.listing.shop, items: [], subtotal: 0, deliveryOption: item.deliveryOption || "standard" };
            }
            acc[shopId].items.push(item);
            acc[shopId].subtotal += (item.listing?.selling_price || 0) * item.qty;
            return acc;
        }, {});
    }, [safeCart]);

    const shopGroups = Object.values(cartByShop);
    const totalItems = safeCart.reduce((s, i) => s + i.qty, 0);
    const totalSubtotal = shopGroups.reduce((s, g) => s + g.subtotal, 0);
    const totalDelivery = shopGroups.reduce((s, g) => {
        const opt = DELIVERY_OPTIONS.find(o => o.id === g.deliveryOption) || DELIVERY_OPTIONS[1];
        return s + opt.fee;
    }, 0);
    const totalValue = totalSubtotal + totalDelivery;

    const updateQty = (listing, newQty) => {
        if (newQty <= 0) {
            saveCart(safeCart.filter(i => !(i.listing?.shop_id === listing.shop_id && i.listing?.product_id === listing.product_id)));
        } else {
            saveCart(safeCart.map(i =>
                (i.listing?.shop_id === listing.shop_id && i.listing?.product_id === listing.product_id)
                    ? { ...i, qty: newQty } : i
            ));
        }
    };

    const removeItem = (listing) => {
        saveCart(safeCart.filter(i => !(i.listing?.shop_id === listing.shop_id && i.listing?.product_id === listing.product_id)));
    };

    const updateDeliveryOption = (shopId, optionId) => {
        saveCart(safeCart.map(i => i.listing?.shop_id === shopId ? { ...i, deliveryOption: optionId } : i));
    };

    if (!isCartOpen) return null;

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", justifyContent: "flex-end", animation: "fadeIn 0.15s" }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(10,15,29,0.7)", backdropFilter: "blur(4px)" }} onClick={() => setIsCartOpen(false)} />

            <div style={{
                position: "relative", width: 440, maxWidth: "90vw",
                background: T.bg, boxShadow: "-10px 0 40px rgba(0,0,0,0.5)",
                display: "flex", flexDirection: "column", animation: "slideInRight 0.3s cubic-bezier(0.16,1,0.3,1)"
            }}>
                {/* Header */}
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <div style={{ fontSize: 20, fontWeight: 900, color: T.t1 }}>🛒 My Cart</div>
                        <div style={{ fontSize: 13, color: T.t3, marginTop: 4 }}>{totalItems} item{totalItems !== 1 ? "s" : ""} from {shopGroups.length} shop{shopGroups.length !== 1 ? "s" : ""}</div>
                    </div>
                    <button onClick={() => setIsCartOpen(false)} style={{ background: "transparent", border: "none", color: T.t3, fontSize: 24, cursor: "pointer" }}>✕</button>
                </div>

                {/* Cart Body */}
                <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }} className="custom-scroll">
                    {safeCart.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px 20px" }}>
                            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>🛒</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: T.t2 }}>Your cart is empty</div>
                            <div style={{ fontSize: 13, color: T.t3, marginTop: 8 }}>Add auto parts from the marketplace</div>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            {shopGroups.map((group, gIdx) => {
                                const deliveryOpt = DELIVERY_OPTIONS.find(o => o.id === group.deliveryOption) || DELIVERY_OPTIONS[1];
                                return (
                                    <div key={group.shopId} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden" }}>
                                        {/* Shop Header */}
                                        <div style={{ padding: "14px 18px", background: T.surface, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <span style={{ fontSize: 18 }}>📦</span>
                                                <div>
                                                    <div style={{ fontSize: 13, fontWeight: 800, color: T.t1 }}>Shipment {gIdx + 1}: {group.shop?.name || "Local Shop"}</div>
                                                    <div style={{ fontSize: 11, color: T.t3 }}>{group.items.length} item{group.items.length !== 1 ? "s" : ""} · {fmt(group.subtotal)}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div style={{ padding: "12px 18px" }}>
                                            {group.items.map((item, i) => (
                                                <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: i < group.items.length - 1 ? `1px solid ${T.border}22` : "none" }}>
                                                    {/* Thumbnail */}
                                                    <div style={{ width: 56, height: 56, borderRadius: 10, background: T.surface, flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        {item.product?.image ? (
                                                            <img src={item.product.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                                                        ) : <span style={{ fontSize: 24, opacity: 0.4 }}>📦</span>}
                                                    </div>

                                                    {/* Info */}
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontSize: 13, fontWeight: 700, color: T.t1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.product?.name || "Auto Part"}</div>
                                                        <div style={{ fontSize: 11, color: T.t3, marginTop: 2 }}>{item.product?.brand}</div>

                                                        {/* Qty controls */}
                                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                                                            <div style={{ display: "flex", alignItems: "center", border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden" }}>
                                                                <button onClick={() => updateQty(item.listing, item.qty - 1)} style={{ width: 28, height: 28, background: T.surface, border: "none", color: T.t1, cursor: "pointer", fontSize: 14 }}>−</button>
                                                                <span style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, fontFamily: FONT.mono, color: T.t1 }}>{item.qty}</span>
                                                                <button onClick={() => updateQty(item.listing, item.qty + 1)} style={{ width: 28, height: 28, background: T.surface, border: "none", color: T.t1, cursor: "pointer", fontSize: 14 }}>+</button>
                                                            </div>
                                                            <button onClick={() => removeItem(item.listing)} style={{ background: "transparent", border: "none", color: T.crimson, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Remove</button>
                                                        </div>
                                                    </div>

                                                    {/* Price */}
                                                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                                                        <div style={{ fontSize: 15, fontWeight: 900, color: T.t1, fontFamily: FONT.mono }}>{fmt(item.listing?.selling_price * item.qty)}</div>
                                                        {item.qty > 1 && <div style={{ fontSize: 11, color: T.t3 }}>{fmt(item.listing?.selling_price)} each</div>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Delivery Option Selector */}
                                        <div style={{ padding: "12px 18px", background: T.bg, borderTop: `1px solid ${T.border}` }}>
                                            <div style={{ fontSize: 11, fontWeight: 700, color: T.t3, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Delivery Speed</div>
                                            <div style={{ display: "flex", gap: 8 }}>
                                                {DELIVERY_OPTIONS.map(opt => (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() => updateDeliveryOption(group.shopId, opt.id)}
                                                        style={{
                                                            flex: 1, padding: "8px 10px",
                                                            background: group.deliveryOption === opt.id ? `${T.amber}14` : T.surface,
                                                            border: `1.5px solid ${group.deliveryOption === opt.id ? T.amber : T.border}`,
                                                            borderRadius: 8, cursor: "pointer",
                                                            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                                                            transition: "all 0.15s"
                                                        }}
                                                    >
                                                        <span style={{ fontSize: 14 }}>{opt.icon}</span>
                                                        <span style={{ fontSize: 11, fontWeight: 700, color: group.deliveryOption === opt.id ? T.amber : T.t1 }}>{opt.label}</span>
                                                        <span style={{ fontSize: 10, color: T.t3 }}>{opt.desc}</span>
                                                        <span style={{ fontSize: 11, fontWeight: 800, color: group.deliveryOption === opt.id ? T.amber : T.t2, fontFamily: FONT.mono }}>
                                                            {opt.fee === 0 ? "FREE" : `₹${opt.fee}`}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer with Checkout */}
                {safeCart.length > 0 && (
                    <div style={{ padding: "16px 20px", borderTop: `1px solid ${T.border}`, background: T.card }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: T.t2, marginBottom: 6 }}>
                            <span>Subtotal ({totalItems} items)</span>
                            <span style={{ fontFamily: FONT.mono }}>{fmt(totalSubtotal)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: T.t2, marginBottom: 10 }}>
                            <span>Delivery ({shopGroups.length} shipment{shopGroups.length > 1 ? "s" : ""})</span>
                            <span style={{ fontFamily: FONT.mono }}>{totalDelivery === 0 ? "FREE" : fmt(totalDelivery)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 900, color: T.t1, borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>
                            <span>Total</span>
                            <span style={{ fontFamily: FONT.mono, color: T.amber }}>{fmt(totalValue)}</span>
                        </div>
                        <button
                            onClick={() => { setIsCartOpen(false); onCheckout && onCheckout(); }}
                            style={{
                                marginTop: 14, width: "100%", background: T.amber, color: "#000",
                                border: "none", borderRadius: 12, padding: "14px",
                                fontSize: 15, fontWeight: 900, cursor: "pointer",
                                boxShadow: `0 6px 20px ${T.amber}44`,
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                            }}
                        >
                            🔒 Proceed to Checkout — {fmt(totalValue)}
                        </button>
                        <div style={{ textAlign: "center", fontSize: 11, color: T.t3, marginTop: 8 }}>Escrow-protected payment</div>
                    </div>
                )}
            </div>
        </div>
    );
}
