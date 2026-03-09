import { useState, useMemo } from "react";
import { T, FONT } from "../theme";
import { useStore } from "../store";
import { fmt, fmtDateTime, daysAgo, uid } from "../utils";
import { assignDeliveryPartner } from "../marketplace/api/engine";

const STATUS_META = {
    NEW: { label: "New Order", icon: "📋", color: T.sky, action: "Accept & Pack", nextStatus: "ACCEPTED" },
    ACCEPTED: { label: "Accepted", icon: "✅", color: "#2DD4BF", action: "Mark as Packed", nextStatus: "PACKED" },
    PACKED: { label: "Packed", icon: "📦", color: T.amber, action: "Assign Delivery Partner", nextStatus: "DISPATCHED" },
    DISPATCHED: { label: "Dispatched", icon: "🚚", color: T.violet, action: null, nextStatus: null },
    DELIVERED: { label: "Delivered", icon: "✓", color: T.emerald, action: null, nextStatus: null },
    CANCELLED: { label: "Cancelled", icon: "✕", color: T.crimson, action: null, nextStatus: null },
};

const TABS = ["all", "NEW", "ACCEPTED", "PACKED", "DISPATCHED", "DELIVERED"];

export function OrdersPage() {
    const { orders, saveOrders, shops, activeShopId } = useStore();
    const [activeTab, setActiveTab] = useState("all");
    const [expandedOrder, setExpandedOrder] = useState(null);

    const safeOrders = orders || [];

    // Get marketplace orders (they have an address field or COD/Escrow payment)
    const marketplaceOrders = useMemo(() =>
        safeOrders
            .filter(o => o.address || o.payment?.includes("Escrow") || o.payment?.includes("COD") || o.payment?.includes("Prepaid"))
            .filter(o => !activeShopId || o.shopId === activeShopId)
            .sort((a, b) => b.time - a.time),
        [safeOrders, activeShopId]
    );

    const filteredOrders = activeTab === "all" ? marketplaceOrders : marketplaceOrders.filter(o => o.status === activeTab);

    // Count by status
    const statusCounts = useMemo(() => {
        const counts = { all: marketplaceOrders.length };
        Object.keys(STATUS_META).forEach(s => { counts[s] = marketplaceOrders.filter(o => o.status === s).length; });
        return counts;
    }, [marketplaceOrders]);

    const handleAdvanceStatus = (orderId) => {
        const orderIdx = safeOrders.findIndex(o => o.id === orderId);
        if (orderIdx === -1) return;

        const order = safeOrders[orderIdx];
        const meta = STATUS_META[order.status];
        if (!meta?.nextStatus) return;

        const updated = [...safeOrders];
        updated[orderIdx] = {
            ...order,
            status: meta.nextStatus,
            [`${meta.nextStatus.toLowerCase()}At`]: Date.now(),
        };

        // If dispatching, assign delivery partner
        if (meta.nextStatus === "DISPATCHED") {
            const shop = (shops || []).find(s => s.id === order.shopId);
            const partner = assignDeliveryPartner(shop);
            updated[orderIdx].deliveryPartner = partner;
            updated[orderIdx].dispatchedAt = Date.now();
        }

        saveOrders(updated);
    };

    const handleCancelOrder = (orderId) => {
        const updated = safeOrders.map(o => o.id === orderId ? { ...o, status: "CANCELLED", cancelledAt: Date.now() } : o);
        saveOrders(updated);
    };

    const newOrderCount = statusCounts.NEW || 0;

    return (
        <div style={{ padding: "24px 28px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 900, color: T.t1, margin: 0 }}>📦 Marketplace Orders</h1>
                    <p style={{ fontSize: 14, color: T.t3, margin: "6px 0 0" }}>{marketplaceOrders.length} orders from online customers</p>
                </div>
                {newOrderCount > 0 && (
                    <div style={{
                        background: `${T.crimson}18`, border: `2px solid ${T.crimson}44`,
                        borderRadius: 14, padding: "14px 20px",
                        display: "flex", alignItems: "center", gap: 12,
                        animation: "pulse 2s infinite"
                    }}>
                        <span style={{ fontSize: 20 }}>🔴</span>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: T.crimson }}>{newOrderCount} order{newOrderCount > 1 ? "s" : ""} waiting!</div>
                            <div style={{ fontSize: 11, color: T.t3 }}>Accept within 5 mins to maintain rankings</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto" }}>
                {TABS.map(tab => {
                    const cnt = statusCounts[tab] || 0;
                    const isActive = activeTab === tab;
                    const meta = STATUS_META[tab];
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: "10px 16px", borderRadius: 10,
                                background: isActive ? (meta?.color || T.amber) + "22" : T.surface,
                                border: `1.5px solid ${isActive ? (meta?.color || T.amber) : T.border}`,
                                color: isActive ? (meta?.color || T.amber) : T.t2,
                                fontSize: 13, fontWeight: 700, cursor: "pointer",
                                display: "flex", alignItems: "center", gap: 8,
                                transition: "all 0.15s", whiteSpace: "nowrap"
                            }}
                        >
                            {tab === "all" ? "All" : meta?.label || tab}
                            {cnt > 0 && (
                                <span style={{
                                    background: isActive ? (meta?.color || T.amber) : T.border,
                                    color: isActive ? "#000" : T.t3,
                                    fontSize: 11, fontWeight: 900, padding: "2px 8px",
                                    borderRadius: 99
                                }}>{cnt}</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                    <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>📋</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: T.t2 }}>No {activeTab === "all" ? "" : STATUS_META[activeTab]?.label.toLowerCase() + " "}orders</div>
                    <div style={{ fontSize: 13, color: T.t3, marginTop: 8 }}>Marketplace orders from online customers will appear here</div>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {filteredOrders.map(order => {
                        const meta = STATUS_META[order.status] || STATUS_META.NEW;
                        const shop = (shops || []).find(s => s.id === order.shopId);
                        const isExpanded = expandedOrder === order.id;
                        const isNew = order.status === "NEW";

                        return (
                            <div
                                key={order.id}
                                style={{
                                    background: T.card,
                                    border: `${isNew ? "2px" : "1px"} solid ${isNew ? T.crimson + "66" : T.border}`,
                                    borderRadius: 16, overflow: "hidden",
                                    boxShadow: isNew ? `0 0 20px ${T.crimson}22` : "0 2px 8px rgba(0,0,0,0.1)",
                                    transition: "all 0.2s"
                                }}
                            >
                                {/* Order Header */}
                                <div
                                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                    style={{
                                        display: "flex", justifyContent: "space-between", alignItems: "center",
                                        padding: "16px 24px", cursor: "pointer",
                                        background: isNew ? `${T.crimson}08` : "transparent"
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                        <div style={{
                                            width: 40, height: 40, borderRadius: 12,
                                            background: `${meta.color}22`, color: meta.color,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 18, fontWeight: 900
                                        }}>
                                            {meta.icon}
                                        </div>
                                        <div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <span style={{ fontSize: 14, fontWeight: 900, color: T.amber, fontFamily: FONT.mono }}>{order.id}</span>
                                                <span style={{ background: `${meta.color}22`, color: meta.color, fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 99 }}>{meta.label}</span>
                                                {isNew && <span style={{ color: T.crimson, fontSize: 11, fontWeight: 700, animation: "pulse 2s infinite" }}>⏰ Accept now!</span>}
                                            </div>
                                            <div style={{ fontSize: 12, color: T.t3, marginTop: 4 }}>
                                                {order.customer} · {daysAgo(order.time)} · {order.payment}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                        <div style={{ textAlign: "right" }}>
                                            <div style={{ fontSize: 18, fontWeight: 900, color: T.t1, fontFamily: FONT.mono }}>{fmt(order.total)}</div>
                                        </div>
                                        <span style={{ fontSize: 14, color: T.t3, transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div style={{ borderTop: `1px solid ${T.border}`, padding: "20px 24px" }}>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                                            {/* Customer Info */}
                                            <div>
                                                <div style={{ fontSize: 11, fontWeight: 700, color: T.t3, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Customer Details</div>
                                                <div style={{ fontSize: 14, fontWeight: 700, color: T.t1 }}>{order.customer}</div>
                                                <div style={{ fontSize: 13, color: T.t2, marginTop: 4 }}>📱 {order.phone}</div>
                                                {order.address && <div style={{ fontSize: 13, color: T.t2, marginTop: 4 }}>📍 {order.address}</div>}
                                            </div>

                                            {/* Order Info */}
                                            <div>
                                                <div style={{ fontSize: 11, fontWeight: 700, color: T.t3, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Order Details</div>
                                                <div style={{ fontSize: 13, color: T.t2, lineHeight: 1.7 }}>
                                                    <div><strong>Items:</strong> {order.items}</div>
                                                    <div><strong>Payment:</strong> {order.payment}</div>
                                                    <div><strong>Placed:</strong> {fmtDateTime(order.time)}</div>
                                                    {order.deliverySlot && <div><strong>Delivery:</strong> {order.deliverySlot.icon} {order.deliverySlot.label}</div>}
                                                    {order.deliveryPartner && (
                                                        <div><strong>Driver:</strong> {order.deliveryPartner.icon} {order.deliveryPartner.name} · 📱 {order.deliveryPartner.phone}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div style={{ display: "flex", gap: 12, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
                                            {meta.action && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleAdvanceStatus(order.id); }}
                                                    style={{
                                                        flex: 1, background: meta.color, color: "#000",
                                                        border: "none", borderRadius: 12, padding: "14px 20px",
                                                        fontSize: 14, fontWeight: 900, cursor: "pointer",
                                                        boxShadow: `0 4px 16px ${meta.color}44`,
                                                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                                                    }}
                                                >
                                                    {order.status === "NEW" && "✓"} {meta.action}
                                                </button>
                                            )}
                                            {(order.status === "NEW" || order.status === "ACCEPTED") && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleCancelOrder(order.id); }}
                                                    style={{
                                                        background: T.surface, border: `1px solid ${T.crimson}44`,
                                                        color: T.crimson, borderRadius: 12, padding: "14px 20px",
                                                        fontSize: 13, fontWeight: 700, cursor: "pointer"
                                                    }}
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
                                            {order.status === "DELIVERED" && (
                                                <div style={{
                                                    flex: 1, padding: "14px 20px", borderRadius: 12,
                                                    background: `${T.emerald}14`, border: `1px solid ${T.emerald}44`,
                                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                                    fontSize: 14, fontWeight: 700, color: T.emerald
                                                }}>
                                                    ✓ Completed — {order.paymentSettled ? "Payment Settled" : "Settlement Pending"}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
