import { useState } from "react";
import { T, FONT } from "../../theme";
import { VEHICLES } from "../api/mockDatabase";
import { useMarketplaceStore } from "../store/useMarketplaceStore";

export function VehicleSelectorModal({ open, onClose }) {
  const { setVehicleId, vehicle: currentVehicle } = useMarketplaceStore();
  const [type, setType] = useState("Car");
  const [brand, setBrand] = useState("");

  if (!open) return null;

  // Filter mocked DB
  const brands = [...new Set(VEHICLES.filter(v => v.type === type).map(v => v.brand))];
  const models = VEHICLES.filter(v => v.type === type && (!brand || v.brand === brand));

  const selectVehicle = (v) => {
    setVehicleId(v.id);
    onClose();
  };

  const removeVehicle = () => {
    setVehicleId(null);
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", animation: "fade 0.2s" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }} onClick={onClose} />
      
      <div style={{ position: "relative", background: T.surface, width: 440, borderRadius: 20, boxShadow: "0 24px 60px rgba(0,0,0,0.5)", border: `1px solid ${T.border}`, overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
        
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", background: T.card }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.t1 }}>Select Your Vehicle</div>
            <div style={{ fontSize: 13, color: T.t3, marginTop: 4 }}>We'll only show parts guaranteed to fit.</div>
          </div>
          <button onClick={onClose} style={{ background:"transparent", border:"none", color:T.t3, fontSize: 24, cursor:"pointer" }}>✕</button>
        </div>

        {/* Content */}
        <div style={{ padding: 24, overflowY:"auto" }}>
          
          {/* Current Selection */}
          {currentVehicle && (
            <div style={{ background: `${T.emerald}14`, border: `1px solid ${T.emerald}33`, borderRadius: 12, padding: "12px 16px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>{currentVehicle.type === "Car" ? "🚗" : "🏍️"}</span>
                <div>
                  <div style={{ fontSize: 12, color: T.emerald, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Current Vehicle</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: T.t1 }}>{currentVehicle.brand} {currentVehicle.model} ({currentVehicle.year})</div>
                </div>
              </div>
              <button 
                onClick={removeVehicle}
                style={{ background:"transparent", border:`1px solid ${T.border}`, color:T.t2, borderRadius: 6, padding: "6px 10px", fontSize: 11, cursor:"pointer", fontWeight: 700 }}
              >
                Clear
              </button>
            </div>
          )}

          {/* Type Toggle */}
          <div style={{ display: "flex", background: T.bg, borderRadius: 10, padding: 4, marginBottom: 20 }}>
            {["Car", "Bike"].map(t => (
              <button 
                key={t}
                onClick={() => { setType(t); setBrand(""); }}
                style={{ flex: 1, background: type === t ? T.amber : "transparent", color: type === t ? "#000" : T.t2, border: "none", borderRadius: 8, padding: "8px", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}
              >
                {t === "Car" ? "🚙 Car" : "🏍️ Two Wheeler"}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 12, fontSize: 12, color: T.t3, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Choose Make</div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 16, marginBottom: 8 }} className="no-scrollbar">
            {brands.map(b => (
              <button 
                key={b}
                onClick={() => setBrand(brand === b ? "" : b)}
                style={{ background: brand === b ? T.amberGlow : T.bg, border: `1px solid ${brand === b ? T.amber : T.border}`, color: brand === b ? T.amber : T.t1, borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0, transition: "all 0.15s" }}
              >
                {b}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 12, fontSize: 12, color: T.t3, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Select Model</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {models.map(m => (
              <div 
                key={m.id}
                onClick={() => selectVehicle(m)}
                style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", transition: "all 0.1s" }}
                className="mp-card-hover"
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: T.t1 }}>{m.brand} {m.model}</div>
                <div style={{ fontSize: 12, color: T.t3, marginTop: 2 }}>{m.year} · {m.variant}</div>
              </div>
            ))}
            {models.length === 0 && (
              <div style={{ gridColumn: "span 2", padding: 20, textAlign: "center", color: T.t4, fontSize: 13 }}>
                No models found matching that criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
