import { useState } from "react";
import { T, FONT } from "../theme";
import { fmt, daysAgo } from "../utils";
import { Btn } from "../components/ui";

const S = {
    NEW: { bg: `${T.sky}18`, color: T.sky, label: "New Order", next: "Accept" },
    ACCEPTED: { bg: `${T.teal}18`, color: "#2DD4BF", label: "Accepted", next: "Pack" },
    PACKED: { bg: `${T.amber}18`, color: T.amber, label: "Packed", next: "Dispatch" },
    DISPATCHED: { bg: `${T.violet}18`, color: T.violet, label: "Dispatched", next: "Delivered" },
    DELIVERED: { bg: `${T.emerald}18`, color: T.emerald, label: "Delivered", next: null },
    CANCELLED: { bg: `${T.crimson}18`, color: T.crimson, label: "Cancelled", next: null },
};

const FLOW = ["NEW", "ACCEPTED", "PACKED", "DISPATCHED", "DELIVERED"];

const INIT = [
    { id: "#4421", customer: "Raj Garage, Andheri", phone: "9876543210", items: "Brake Pads × 2, Oil Filter × 4", total: 8980, status: "NEW", time: Date.now() - 600000, payment: "Cash", vehicle: "MH04-AB-9921" },
    { id: "#4420", customer: "AutoFix, Worli", phone: "9812345678", items: "Exide Battery × 1", total: 5800, status: "ACCEPTED", time: Date.now() - 3600000, payment: "UPI", vehicle: null },
    { id: "#4419", customer: "Sri Durga Motors, Dadar", phone: "9900112233", items: "Shock Absorber × 2, Belt × 3", total: 8850, status: "PACKED", time: Date.now() - 7200000, payment: "Paid", vehicle: "KA01-MX-4421" },
    { id: "#4418", customer: "Hussain Auto, Kurla", phone: "9765432100", items: "Exide Battery × 1", total: 5800, status: "DELIVERED", time: Date.now() - 18000000, payment: "UPI", vehicle: "DL03-CD-2211" },
    { id: "#4417", customer: "Saini Car Care, Bandra", phone: "9988776655", items: "Spark Plugs × 8", total: 1320, status: "CANCELLED", time: Date.now() - 86400000, payment: "Cash", vehicle: null },
];

export function OrdersPage({ products, onSale, toast }) {
    const [orders, setOrders] = useState(INIT);

    const advance = id => setOrders(p => p.map(o => { if (o.id !== id) return o; const i = FLOW.indexOf(o.status); return i === -1 || i === FLOW.length - 1 ? o : { ...o, status: FLOW[i + 1] }; }));
    const reject = id => setOrders(p => p.map(o => o.id !== id ? o : { ...o, status: "CANCELLED" }));

    return (
        <div className="page-in" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8 }}>
                {["NEW", "ACCEPTED", "PACKED", "DISPATCHED", "DELIVERED", "CANCELLED"].map(s => {
                    const m = S[s]; const cnt = orders.filter(o => o.status === s).length;
                    return (
                        <div key={s} style={{ background: m.bg, border: `1px solid ${m.color}28`, borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
                            <div style={{ fontSize: 24, fontWeight: 900, color: m.color, fontFamily: FONT.mono }}>{cnt}</div>
                            <div style={{ fontSize: 10, color: m.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.label}</div>
                        </div>
                    );
                })}
            </div>
            {orders.map(o => {
                const m = S[o.status];
                return (
                    <div key={o.id} className="card-hover" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }}>
                        <div style={{ fontFamily: FONT.mono, color: T.amber, fontWeight: 700, fontSize: 14, minWidth: 62 }}>{o.id}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, color: T.t1, fontSize: 14 }}>{o.customer}</div>
                            <div style={{ fontSize: 12, color: T.t3, marginTop: 2 }}>{o.items} · {daysAgo(o.time)} · 📱{o.phone}</div>
                            {o.vehicle && <div style={{ fontSize: 11, color: T.amber, fontFamily: FONT.mono, marginTop: 2 }}>🚗 {o.vehicle}</div>}
                        </div>
                        <div style={{ fontWeight: 900, fontSize: 17, color: T.t1, fontFamily: FONT.mono }}>{fmt(o.total)}</div>
                        <span style={{ background: m.bg, color: m.color, fontSize: 11, padding: "4px 12px", borderRadius: 99, fontWeight: 700, fontFamily: FONT.ui }}>{m.label}</span>
                        {m.next && <Btn size="sm" variant="emerald" onClick={() => advance(o.id)}>✓ {m.next}</Btn>}
                        {o.status === "NEW" && <Btn size="sm" variant="danger" onClick={() => reject(o.id)}>✕ Reject</Btn>}
                    </div>
                );
            })}
        </div>
    );
}
