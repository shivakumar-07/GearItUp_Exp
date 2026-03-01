import { T } from './theme';

export const CATEGORIES = ["Engine", "Brakes", "Electrical", "Suspension", "Filters", "Cooling", "Body", "Tyres", "Lubrication", "Transmission", "Clutch", "Steering"];
export const EMOJIS = ["🔧", "⚙️", "🔩", "🛢️", "⚡", "🔋", "🌀", "💧", "📯", "🔌", "🔑", "🛞", "🪛", "🔦", "📦", "🏷️", "🪝", "⛽", "🧴", "🔴", "🔵", "⬛"];

export const uid = () => Math.random().toString(36).slice(2, 10);

export const SEED_PRODUCTS = [
    { id: "p1", name: "Bosch Brake Pad Set — Front", sku: "BRK-F-0042", category: "Brakes", brand: "Bosch", vehicles: "Car — Maruti Swift, i20, Baleno", buyPrice: 1200, sellPrice: 1850, stock: 24, minStock: 10, location: "Rack A-12", supplier: "Bosch India Pvt Ltd", gst: 18, image: "🔧", notes: "Fits 2015-2023 models" },
    { id: "p2", name: "Denso O2 Sensor Universal", sku: "ELC-O2-117", category: "Electrical", brand: "Denso", vehicles: "Car — Universal", buyPrice: 890, sellPrice: 1400, stock: 6, minStock: 8, location: "Rack B-04", supplier: "Denso Corporation", gst: 18, image: "⚡", notes: "" },
    { id: "p3", name: "Mahle Oil Filter HF147", sku: "ENG-OF-147", category: "Filters", brand: "Mahle", vehicles: "Car — Maruti, Hyundai", buyPrice: 180, sellPrice: 320, stock: 82, minStock: 20, location: "Rack C-01", supplier: "Mahle GmbH India", gst: 18, image: "🛢️", notes: "Fast moving" },
    { id: "p4", name: "NGK Spark Plug BKR6E", sku: "ENG-SP-BKR", category: "Engine", brand: "NGK", vehicles: "Bike — Splendor, Activa, FZ", buyPrice: 95, sellPrice: 165, stock: 3, minStock: 25, location: "Rack C-08", supplier: "NGK India", gst: 18, image: "⚙️", notes: "Critical: reorder now" },
    { id: "p5", name: "Monroe Front Shock Absorber", sku: "SUS-SA-M220", category: "Suspension", brand: "Monroe", vehicles: "Car — Swift, Desire, Wagon R", buyPrice: 2400, sellPrice: 3600, stock: 11, minStock: 5, location: "Rack D-15", supplier: "Tenneco India", gst: 28, image: "🔩", notes: "" },
    { id: "p6", name: "ACDelco Serpentine Belt", sku: "ENG-BLT-ACD", category: "Engine", brand: "ACDelco", vehicles: "Car — Honda City, Amaze", buyPrice: 340, sellPrice: 550, stock: 19, minStock: 10, location: "Rack C-22", supplier: "ACDelco India", gst: 18, image: "⚙️", notes: "" },
    { id: "p7", name: "Exide FFS0-EP44L Battery", sku: "ELC-BAT-EX", category: "Electrical", brand: "Exide", vehicles: "Car — Universal 44Ah", buyPrice: 4200, sellPrice: 5800, stock: 7, minStock: 4, location: "Rack B-01", supplier: "Exide Industries Ltd", gst: 28, image: "🔋", notes: "Includes warranty card" },
    { id: "p8", name: "Minda Horn Assembly 12V", sku: "ELC-HRN-MND", category: "Electrical", brand: "Minda", vehicles: "Bike, Car — Universal", buyPrice: 320, sellPrice: 520, stock: 0, minStock: 6, location: "Rack B-12", supplier: "Minda Industries", gst: 18, image: "📯", notes: "" },
    { id: "p9", name: "Kirloskar Water Pump", sku: "CLG-WP-KIR", category: "Cooling", brand: "Kirloskar", vehicles: "Car — Maruti 800, Alto, WagonR", buyPrice: 1100, sellPrice: 1650, stock: 14, minStock: 5, location: "Rack E-03", supplier: "Kirloskar Industries", gst: 18, image: "💧", notes: "" },
    { id: "p10", name: "Tata Air Filter — Swift Dzire", sku: "ENG-AF-SW01", category: "Filters", brand: "Tata", vehicles: "Car — Swift Dzire 2018+", buyPrice: 220, sellPrice: 380, stock: 41, minStock: 15, location: "Rack C-04", supplier: "Tata AutoComp Systems", gst: 18, image: "🌀", notes: "" },
];

export const genSeededMovements = () => {
    const now = Date.now();
    const d = 86400000;
    return [
        { id: "m1", productId: "p1", productName: "Bosch Brake Pad Set", type: "PURCHASE", qty: 12, unitPrice: 1200, sellingPrice: 1850, total: 14400, gstAmount: 2592, profit: null, date: now - 7 * d, note: "Monthly restock", supplier: "Bosch India Pvt Ltd", invoiceNo: "BINV-2024-1042", payment: "Credit", creditDays: 30, customer: null, vehicle: null, mechanic: null, paymentStatus: "pending" },
        { id: "m2", productId: "p3", productName: "Mahle Oil Filter", type: "PURCHASE", qty: 50, unitPrice: 180, sellingPrice: 320, total: 9000, gstAmount: 1620, profit: null, date: now - 5 * d, note: "Stock up before weekend", supplier: "Mahle GmbH India", invoiceNo: "MINV-0892", payment: "Cash", creditDays: 0, customer: null, vehicle: null, mechanic: null, paymentStatus: "paid" },
        { id: "m3", productId: "p7", productName: "Exide Battery", type: "PURCHASE", qty: 5, unitPrice: 4200, sellingPrice: 5800, total: 21000, gstAmount: 5880, profit: null, date: now - 4 * d, note: "Emergency restock", supplier: "Exide Industries Ltd", invoiceNo: "EINV-7731", payment: "UPI", creditDays: 0, customer: null, vehicle: null, mechanic: null, paymentStatus: "paid" },
        { id: "m4", productId: "p5", productName: "Monroe Shock Absorber", type: "SALE", qty: 2, unitPrice: 3600, sellingPrice: 3600, total: 7200, gstAmount: 2016, profit: 2400, date: now - 3 * d, note: "Online order", supplier: null, invoiceNo: "INV-4416", payment: "UPI", creditDays: 0, customer: "Sri Durga Motors, Dadar", vehicle: "MH02-AB-1234", mechanic: "Ramesh K", paymentStatus: "paid" },
        { id: "m5", productId: "p4", productName: "NGK Spark Plug", type: "SALE", qty: 8, unitPrice: 165, sellingPrice: 165, total: 1320, gstAmount: 238, profit: 560, date: now - 2.5 * d, note: "Workshop bulk order", supplier: null, invoiceNo: "INV-4417", payment: "Cash", creditDays: 0, customer: "Raj Garage, Andheri", vehicle: null, mechanic: null, paymentStatus: "paid" },
        { id: "m6", productId: "p2", productName: "Denso O2 Sensor", type: "ADJUST", qty: -2, unitPrice: 890, sellingPrice: 1400, total: 0, gstAmount: 0, profit: null, date: now - 2 * d, note: "2 units damaged in transit — removed from stock", supplier: null, invoiceNo: null, payment: null, creditDays: 0, customer: null, vehicle: null, mechanic: null, paymentStatus: null },
        { id: "m7", productId: "p1", productName: "Bosch Brake Pad Set", type: "SALE", qty: 3, unitPrice: 1850, sellingPrice: 1850, total: 5550, gstAmount: 999, profit: 1950, date: now - 0.4 * d, note: "Walk-in", supplier: null, invoiceNo: "INV-4418", payment: "Cash", creditDays: 0, customer: "Hussain Auto, Kurla", vehicle: "KA01-MX-4421", mechanic: "Suresh", paymentStatus: "paid" },
        { id: "m8", productId: "p3", productName: "Mahle Oil Filter", type: "SALE", qty: 6, unitPrice: 320, sellingPrice: 320, total: 1920, gstAmount: 346, profit: 840, date: now - 0.2 * d, note: "Regular customer", supplier: null, invoiceNo: "INV-4419", payment: "UPI", creditDays: 0, customer: "Quick Fix, Andheri", vehicle: "MH04-ZZ-9901", mechanic: null, paymentStatus: "paid" },
        { id: "m9", productId: "p6", productName: "ACDelco Belt", type: "SALE", qty: 4, unitPrice: 550, sellingPrice: 550, total: 2200, gstAmount: 396, profit: 840, date: now - 0.1 * d, note: "Garage order", supplier: null, invoiceNo: "INV-4420", payment: "Cash", creditDays: 0, customer: "AutoFix, Worli", vehicle: null, mechanic: "Dinesh", paymentStatus: "paid" },
    ];
};

export const fmt = n => "₹" + Math.abs(+n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
export const fmtN = n => (+n || 0).toLocaleString("en-IN");
export const pct = (a, b) => b > 0 ? (((a) / b) * 100).toFixed(1) + "%" : "0%";
export const margin = (b, s) => s > 0 ? (((s - b) / s) * 100).toFixed(1) : 0;
export const gstAmt = (price, qty, gstRate) => ((price * qty) * gstRate) / 100;

export const fmtDate = ts => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};
export const fmtTime = ts => {
    const d = new Date(ts);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
};
export const fmtDateTime = ts => `${fmtDate(ts)}, ${fmtTime(ts)}`;
export const daysAgo = ts => {
    const diff = Math.floor((Date.now() - ts) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return `${diff}d ago`;
};

export const stockStatus = p => {
    if (p.stock <= 0) return "out";
    if (p.stock < p.minStock) return "low";
    return "ok";
};

export const STATUS = {
    ok: { label: "In Stock", bg: "rgba(16,185,129,0.12)", color: T.emerald, dot: T.emerald },
    low: { label: "Low Stock", bg: "rgba(245,158,11,0.12)", color: T.amber, dot: T.amber },
    out: { label: "Out of Stock", bg: "rgba(239,68,68,0.12)", color: T.crimson, dot: T.crimson },
};
