import { useState, useEffect, useRef } from "react";
import { T, FONT } from "../theme";
import { fmt, fmtDateTime } from "../utils";
import { Modal, Field, Input, Select, Divider, Btn } from "./ui";

export function SaleModal({ open, onClose, product, products, onSave, toast }) {
    const blank = { productId: product?.id || "", qty: "1", sellPrice: String(product?.sellPrice || ""), discount: "0", discountType: "%", customerName: "", customerPhone: "", vehicleReg: "", mechanic: "", payment: "Cash", notes: "" };
    const [f, setF] = useState(blank);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const now = useRef(Date.now());
    useEffect(() => { now.current = Date.now(); }, [open]);

    useEffect(() => {
        if (open) setF({ ...blank, productId: product?.id || "", sellPrice: String(product?.sellPrice || "") });
        setErrors({});
        setShowInvoice(false);
    }, [open, product]);

    const set = k => v => setF(p => ({ ...p, [k]: v }));
    const sel = products?.find(p => p.id === f.productId) || product;

    const qty = +f.qty || 0;
    const sellPrice = +f.sellPrice || (sel?.sellPrice || 0);
    const discAmt = f.discountType === "%"
        ? sellPrice * qty * (+f.discount || 0) / 100
        : +f.discount || 0;
    const subtotal = sellPrice * qty;
    const totalAfterDisc = subtotal - discAmt;
    const gstRate = sel?.gst || 18;
    const gstAmt_ = (totalAfterDisc * gstRate) / (100 + gstRate); // GST inclusive
    const profitPerUnit = sellPrice - (sel?.buyPrice || 0);
    const totalProfit = (profitPerUnit * qty) - discAmt;
    const invoiceNo = "INV-" + Math.floor(Math.random() * 9000 + 4000);

    const validate = () => {
        const e = {};
        if (!f.productId) e.productId = "Select a product";
        if (!f.qty || +f.qty <= 0) e.qty = "Enter quantity";
        if (sel && +f.qty > sel.stock) e.qty = `Only ${sel.stock} in stock`;
        if (!f.sellPrice || +f.sellPrice <= 0) e.sellPrice = "Enter price";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        await new Promise(r => setTimeout(r, 300));
        onSave({
            productId: f.productId,
            qty: +f.qty,
            sellPrice,
            discount: discAmt,
            discountType: f.discountType,
            discountValue: +f.discount || 0,
            subtotal,
            total: totalAfterDisc,
            gstAmount: gstAmt_,
            profit: totalProfit,
            customerName: f.customerName,
            customerPhone: f.customerPhone,
            vehicleReg: f.vehicleReg,
            mechanic: f.mechanic,
            payment: f.payment,
            notes: f.notes,
            invoiceNo,
            date: now.current,
        });
        setSaving(false);
        setShowInvoice(true);
    };

    const paymentModes = ["Cash", "UPI", "Card", "Credit", "Cheque"];

    if (showInvoice && sel) return (
        <Modal open={open} onClose={onClose} title="Sale Recorded ✓" width={440}>
            <div style={{ background: T.emeraldBg, border: `1px solid rgba(16,185,129,0.25)`, borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 24 }}>✓</span>
                <div><div style={{ fontWeight: 700, color: T.emerald }}>Sale recorded successfully</div><div style={{ fontSize: 12, color: T.t3, marginTop: 2 }}>{qty} × {sel.name.slice(0, 30)} · {fmt(totalAfterDisc)}</div></div>
            </div>
            {/* Mini Invoice */}
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px 18px", fontSize: 13, fontFamily: FONT.ui }}>
                <div style={{ textAlign: "center", paddingBottom: 12, borderBottom: `1px dashed ${T.border}`, marginBottom: 12 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: T.t1 }}>RAVI AUTO PARTS</div>
                    <div style={{ fontSize: 12, color: T.t3 }}>Hyderabad · GST: 36AAXXX1234X1Z5</div>
                    <div style={{ fontSize: 12, color: T.t3, marginTop: 2, fontFamily: FONT.mono }}>{invoiceNo} · {fmtDateTime(now.current)}</div>
                </div>
                {f.customerName && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ color: T.t3 }}>Customer</span><span style={{ fontWeight: 600 }}>{f.customerName}</span></div>}
                {f.vehicleReg && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ color: T.t3 }}>Vehicle</span><span style={{ fontFamily: FONT.mono, fontWeight: 700, color: T.amber }}>{f.vehicleReg}</span></div>}
                <div style={{ background: T.card, borderRadius: 8, padding: "8px 12px", marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ color: T.t2, fontSize: 13 }}>{sel.name.slice(0, 30)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.t3 }}>
                        <span>{qty} × {fmt(sellPrice)}</span>
                        <span style={{ color: T.t1, fontWeight: 700, fontFamily: FONT.mono }}>{fmt(subtotal)}</span>
                    </div>
                    {discAmt > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.crimson, marginTop: 4 }}><span>Discount</span><span>−{fmt(discAmt)}</span></div>}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, borderTop: `1px solid ${T.border}`, paddingTop: 10, color: T.t1 }}>
                    <span>TOTAL</span><span style={{ fontFamily: FONT.mono }}>{fmt(totalAfterDisc)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.t3, marginTop: 6 }}>
                    <span>Payment</span><span>{f.payment}</span>
                </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <Btn variant="ghost" full style={{ fontSize: 12 }}>🖨 Print</Btn>
                <Btn variant="ghost" full style={{ fontSize: 12 }}>💬 WhatsApp</Btn>
                <Btn variant="amber" full onClick={onClose}>Done</Btn>
            </div>
        </Modal>
    );

    return (
        <Modal open={open} onClose={onClose} title="📤 Sale Entry" subtitle="Record a product sold to customer" width={620}>
            {!product && (
                <div style={{ marginBottom: 18 }}>
                    <Field label="Product" required error={errors.productId}>
                        <Select value={f.productId} onChange={v => {
                            const p = products?.find(x => x.id === v);
                            setF(prev => ({ ...prev, productId: v, sellPrice: String(p?.sellPrice || "") }));
                        }} options={[{ value: "", label: "— Select product —" }, ...(products || []).map(p => ({ value: p.id, label: `${p.image} ${p.name} (Stock: ${p.stock})` }))]} />
                    </Field>
                </div>
            )}

            {sel && (
                <div style={{ background: T.amberGlow, border: `1px solid rgba(245,158,11,0.2)`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 14, alignItems: "center" }}>
                    <span style={{ fontSize: 32 }}>{sel.image}</span>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: T.t1, fontSize: 14 }}>{sel.name}</div>
                        <div style={{ fontSize: 12, color: T.t3, marginTop: 2, fontFamily: FONT.mono }}>{sel.sku} · {sel.vehicles}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: T.t3 }}>Stock</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: sel.stock < sel.minStock ? T.crimson : T.t1, fontFamily: FONT.mono }}>{sel.stock}</div>
                    </div>
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label="Quantity" required error={errors.qty} hint={sel ? `Available: ${sel.stock} units` : ""}>
                    <Input type="number" value={f.qty} onChange={set("qty")} placeholder="1" suffix="units" autoFocus={!!product} />
                </Field>
                <Field label="Selling Price / Unit" required error={errors.sellPrice} hint={sel ? `Default: ${fmt(sel.sellPrice)}` : ""}>
                    <Input type="number" value={f.sellPrice} onChange={set("sellPrice")} placeholder={String(sel?.sellPrice || "")} prefix="₹" />
                </Field>

                {/* Discount */}
                <div style={{ gridColumn: "span 2", display: "grid", gridTemplateColumns: "120px 1fr", gap: 10 }}>
                    <Field label="Discount Type">
                        <Select value={f.discountType} onChange={set("discountType")} options={[{ value: "%", label: "Percent (%)" }, { value: "flat", label: "Flat Amount (₹)" }]} />
                    </Field>
                    <Field label={`Discount ${f.discountType === "%" ? "%" : "₹ Amount"}`} hint={discAmt > 0 ? `= ${fmt(discAmt)} off` : ""}>
                        <Input type="number" value={f.discount} onChange={set("discount")} placeholder="0" prefix={f.discountType === "flat" ? "₹" : undefined} suffix={f.discountType === "%" ? "%" : undefined} />
                    </Field>
                </div>

                <Divider label="Customer Details" />
                <div style={{ gridColumn: "span 2" }} />

                <Field label="Customer / Garage Name">
                    <Input value={f.customerName} onChange={set("customerName")} placeholder="Raj Garage, Walk-in…" icon="👤" />
                </Field>
                <Field label="Phone Number">
                    <Input value={f.customerPhone} onChange={set("customerPhone")} placeholder="+91 98765 43210" icon="📞" />
                </Field>
                <Field label="Vehicle Registration" hint="For warranty / reference">
                    <Input value={f.vehicleReg} onChange={set("vehicleReg")} placeholder="MH 02 AB 1234" icon="🚗" />
                </Field>
                <Field label="Mechanic / Technician">
                    <Input value={f.mechanic} onChange={set("mechanic")} placeholder="Ramesh K" icon="🔧" />
                </Field>

                <Divider label="Payment" />
                <div style={{ gridColumn: "span 2" }} />

                <div style={{ gridColumn: "span 2" }}>
                    <Field label="Payment Mode">
                        <div style={{ display: "flex", gap: 6 }}>
                            {paymentModes.map(pm => (
                                <button key={pm} onClick={() => set("payment")(pm)} style={{ flex: 1, background: f.payment === pm ? (pm === "Credit" ? T.crimson : T.amber) : "transparent", color: f.payment === pm ? "#000" : T.t2, border: `1px solid ${f.payment === pm ? (pm === "Credit" ? T.crimson : T.amber) : T.border}`, borderRadius: 7, padding: "8px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: FONT.ui, transition: "all 0.12s", textAlign: "center" }}>
                                    {pm === "Cash" ? "💵" : pm === "UPI" ? "📱" : pm === "Card" ? "💳" : pm === "Credit" ? "📋" : "📝"}<br />{pm}
                                </button>
                            ))}
                        </div>
                    </Field>
                </div>
                <div style={{ gridColumn: "span 2" }}>
                    <Field label="Notes"><Input value={f.notes} onChange={set("notes")} placeholder="e.g. Regular customer, warranty given" /></Field>
                </div>

                {/* LIVE BILL PREVIEW */}
                {qty > 0 && sellPrice > 0 && (
                    <>
                        <Divider label="Bill Preview" />
                        <div style={{ gridColumn: "span 2", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 18px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                        <span style={{ fontSize: 13, color: T.t3 }}>Subtotal</span>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: T.t1, fontFamily: FONT.mono }}>{fmt(subtotal)}</span>
                                    </div>
                                    {discAmt > 0 && (
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                            <span style={{ fontSize: 13, color: T.crimson }}>Discount</span>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: T.crimson, fontFamily: FONT.mono }}>−{fmt(discAmt)}</span>
                                        </div>
                                    )}
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                        <span style={{ fontSize: 13, color: T.t3 }}>GST ({sel?.gst || 18}%, incl.)</span>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: T.amber, fontFamily: FONT.mono }}>{fmt(gstAmt_)}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
                                        <span style={{ fontSize: 15, fontWeight: 800, color: T.t1 }}>TOTAL</span>
                                        <span style={{ fontSize: 18, fontWeight: 900, color: T.sky, fontFamily: FONT.mono }}>{fmt(totalAfterDisc)}</span>
                                    </div>
                                </div>
                                <div style={{ borderLeft: `1px solid ${T.border}`, paddingLeft: 14 }}>
                                    <div style={{ fontSize: 11, color: T.t3, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Profit Analysis</div>
                                    <div style={{ marginBottom: 6 }}>
                                        <div style={{ fontSize: 11, color: T.t3 }}>Cost price × {qty}</div>
                                        <div style={{ fontFamily: FONT.mono, fontWeight: 700, color: T.t2 }}>−{fmt((sel?.buyPrice || 0) * qty)}</div>
                                    </div>
                                    <div style={{ marginBottom: 6 }}>
                                        <div style={{ fontSize: 11, color: T.t3 }}>Discount given</div>
                                        <div style={{ fontFamily: FONT.mono, fontWeight: 700, color: discAmt > 0 ? T.crimson : T.t3 }}>{discAmt > 0 ? `−${fmt(discAmt)}` : "—"}</div>
                                    </div>
                                    <div style={{ paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
                                        <div style={{ fontSize: 11, color: T.t3 }}>Net profit</div>
                                        <div style={{ fontSize: 20, fontWeight: 900, fontFamily: FONT.mono, color: totalProfit >= 0 ? T.emerald : T.crimson }}>{totalProfit >= 0 ? "+" : ""}{fmt(totalProfit)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22, paddingTop: 18, borderTop: `1px solid ${T.border}` }}>
                <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
                <Btn variant="amber" loading={saving} onClick={handleSave}>📤 Record Sale & Generate Bill</Btn>
            </div>
        </Modal>
    );
}
