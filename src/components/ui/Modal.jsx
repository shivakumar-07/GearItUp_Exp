import { useEffect } from "react";
import { T, FONT } from "../../theme";

export function Modal({ open, onClose, title, subtitle, width = 560, children }) {
    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);
    if (!open) return null;
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(5,8,13,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(3px)", animation: "fadeIn 0.15s ease" }}
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-in" style={{ background: T.card, border: `1px solid ${T.borderHi}`, borderRadius: 18, padding: 28, width: "100%", maxWidth: width, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.6)", fontFamily: FONT.ui }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                    <div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: T.t1, letterSpacing: "-0.02em" }}>{title}</div>
                        {subtitle && <div style={{ fontSize: 13, color: T.t3, marginTop: 3 }}>{subtitle}</div>}
                    </div>
                    <button onClick={onClose} style={{ background: T.surface, border: `1px solid ${T.border}`, cursor: "pointer", width: 32, height: 32, borderRadius: 8, fontSize: 16, color: T.t3, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.color = T.t1; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.t3; }}>×</button>
                </div>
                {children}
            </div>
        </div>
    );
}
