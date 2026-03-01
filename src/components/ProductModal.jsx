import { useState, useEffect } from "react";
import { T, FONT } from "../theme";
import { uid, CATEGORIES, EMOJIS, fmt } from "../utils";
import { Modal, Field, Input, Select, Divider, Btn } from "./ui";

export function ProductModal({ open, onClose, product, onSave, toast }) {
    const isEdit = !!product;
    const blank = { name: "", sku: "", category: "Engine", brand: "", vehicles: "", buyPrice: "", sellPrice: "", stock: "", minStock: "10", location: "", supplier: "", image: "📦", gst: "18", notes: "" };
    const [f, setF] = useState(blank);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setF(product ? { ...product, buyPrice: String(product.buyPrice), sellPrice: String(product.sellPrice), stock: String(product.stock), minStock: String(product.minStock), gst: String(product.gst || 18) } : blank);
        setErrors({});
    }, [product, open]);

    const set = k => v => setF(p => ({ ...p, [k]: v }));
    const profit = f.buyPrice && f.sellPrice ? +f.sellPrice - +f.buyPrice : null;
    const mg = profit !== null && +f.sellPrice > 0 ? ((profit / +f.sellPrice) * 100).toFixed(1) : null;

    const validate = () => {
        const e = {};
        if (!f.name.trim()) e.name = "Required";
        if (!f.sku.trim()) e.sku = "Required";
        if (!f.buyPrice || isNaN(f.buyPrice)) e.buyPrice = "Invalid";
        if (!f.sellPrice || isNaN(f.sellPrice)) e.sellPrice = "Invalid";
        if (f.stock === "" || isNaN(f.stock)) e.stock = "Required";
        setErrors(e);
        return !Object.keys(e).length;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        await new Promise(r => setTimeout(r, 200));
        onSave({ ...f, id: product?.id || "p" + uid(), buyPrice: +f.buyPrice, sellPrice: +f.sellPrice, stock: +f.stock, minStock: +f.minStock || 10, gst: +f.gst || 18 });
        toast(isEdit ? "Product updated!" : "Product added to inventory!", "success", isEdit ? undefined : "New Product");
        setSaving(false);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose} title={isEdit ? "Edit Product" : "Add New Product"} subtitle={isEdit ? `SKU: ${product.sku}` : "Register a new product in your inventory"} width={640}>
            <div style={{ marginBottom: 16 }}>
                <Field label="Product Icon / Image">
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {EMOJIS.map(e => (
                            <button key={e} onClick={() => set("image")(e)} style={{ width: 34, height: 34, borderRadius: 7, border: `1.5px solid ${f.image === e ? T.amber : T.border}`, background: f.image === e ? T.amberGlow : "transparent", cursor: "pointer", fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.12s" }}>{e}</button>
                        ))}
                    </div>
                </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div style={{ gridColumn: "span 2" }}><Field label="Product Name" required error={errors.name}><Input value={f.name} onChange={set("name")} placeholder="Bosch Brake Pad Set — Front" /></Field></div>
                <Field label="SKU / Code" required error={errors.sku}><Input value={f.sku} onChange={set("sku")} placeholder="BRK-F-0042" /></Field>
                <Field label="Category"><Select value={f.category} onChange={set("category")} options={CATEGORIES.map(c => ({ value: c, label: c }))} /></Field>
                <Field label="Brand / Manufacturer"><Input value={f.brand} onChange={set("brand")} placeholder="Bosch, NGK…" /></Field>
                <Field label="Supplier"><Input value={f.supplier} onChange={set("supplier")} placeholder="Supplier name" /></Field>
                <div style={{ gridColumn: "span 2" }}><Field label="Vehicle Compatibility"><Input value={f.vehicles} onChange={set("vehicles")} placeholder="Car — Swift, i20 / Bike — Splendor, Activa" /></Field></div>
                <div style={{ gridColumn: "span 2" }}><Field label="Notes / Description"><Input value={f.notes} onChange={set("notes")} placeholder="Any important notes" /></Field></div>

                <Divider label="Pricing" />
                <div style={{ gridColumn: "span 2" }} />
                <Field label="Buying Price (₹)" required error={errors.buyPrice}><Input type="number" value={f.buyPrice} onChange={set("buyPrice")} placeholder="0" prefix="₹" /></Field>
                <Field label="Selling Price (₹)" required error={errors.sellPrice}><Input type="number" value={f.sellPrice} onChange={set("sellPrice")} placeholder="0" prefix="₹" /></Field>
                <Field label="GST Rate"><Select value={String(f.gst)} onChange={set("gst")} options={["0", "5", "12", "18", "28"].map(v => ({ value: v, label: v + "% GST" }))} /></Field>

                {profit !== null && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div style={{ background: profit > 0 ? T.emeraldBg : T.crimsonBg, borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
                            <div style={{ fontSize: 11, color: profit > 0 ? T.emerald : T.crimson, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Profit/Unit</div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: profit > 0 ? T.emerald : T.crimson, fontFamily: FONT.mono }}>{fmt(profit)}</div>
                        </div>
                        <div style={{ background: T.amberGlow, borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
                            <div style={{ fontSize: 11, color: T.amber, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Margin</div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: T.amber, fontFamily: FONT.mono }}>{mg}%</div>
                        </div>
                    </div>
                )}

                <Divider label="Inventory" />
                <div style={{ gridColumn: "span 2" }} />
                <Field label={isEdit ? "Current Stock" : "Opening Stock"} required error={errors.stock}><Input type="number" value={f.stock} onChange={set("stock")} placeholder="0" suffix="units" /></Field>
                <Field label="Min Stock Alert" hint="Alert when stock drops below"><Input type="number" value={f.minStock} onChange={set("minStock")} placeholder="10" suffix="units" /></Field>
                <Field label="Storage Location" hint="Rack / shelf code"><Input value={f.location} onChange={set("location")} placeholder="Rack A-12" /></Field>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22, paddingTop: 18, borderTop: `1px solid ${T.border}` }}>
                <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
                <Btn variant="amber" loading={saving} onClick={handleSave}>💾 {isEdit ? "Save Changes" : "Add Product"}</Btn>
            </div>
        </Modal>
    );
}
