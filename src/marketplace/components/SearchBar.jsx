import { useState, useMemo } from "react";
import { T, FONT } from "../../theme";
import { searchEngine } from "../api/engine";
import { useMarketplaceStore } from "../store/useMarketplaceStore";

export function SearchBar({ onSelectProduct }) {
  const { vehicle } = useMarketplaceStore();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  // Derive results using our mocked logic engine
  const results = useMemo(() => {
    return searchEngine(query, vehicle?.id);
  }, [query, vehicle]);

  const hasResults = results.products.length > 0 || results.categories.length > 0 || results.shops.length > 0;

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 640 }}>
      <div 
        style={{ 
          background: focused ? T.bg : T.surface, 
          border: `1.5px solid ${focused ? T.amber : T.border}`,
          borderRadius: 12,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          transition: "all 0.2s",
          boxShadow: focused ? `0 0 0 3px ${T.amber}22` : "none"
        }}
      >
        <span style={{ fontSize: 16, color: focused ? T.amber : T.t3 }}>🔍</span>
        <input 
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)} // delay to allow clicks
          placeholder="Search for parts, brands, categories or shops..."
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: T.t1,
            fontSize: 15,
            fontWeight: 500,
            fontFamily: FONT.ui,
            width: "100%"
          }}
        />
        {query && (
          <button 
            onClick={() => setQuery("")} 
            style={{ background: "transparent", border: "none", color: T.t4, cursor: "pointer", fontSize: 16 }}
          >
            ✕
          </button>
        )}
      </div>

      {/* AUTOCOMPLETE DROPDOWN */}
      {focused && query.length >= 2 && (
        <div style={{
          position: "absolute",
          top: "100%", left: 0, right: 0,
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          marginTop: 8,
          boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
          zIndex: 1000,
          overflow: "hidden",
          maxHeight: 500,
          display: "flex",
          flexDirection: "column"
        }}>
          {!hasResults ? (
            <div style={{ padding: 24, textAlign: "center", color: T.t3, fontSize: 14 }}>
              No results found for "{query}"
            </div>
          ) : (
            <div style={{ overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Products */}
              {results.products.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, color: T.t3, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", padding: "0 8px 8px" }}>Products {vehicle && " (Compatible)"}</div>
                  {results.products.map(p => (
                    <div 
                      key={p.product.id} 
                      onClick={() => onSelectProduct && onSelectProduct(p)}
                      style={{ padding: "8px 10px", borderRadius: 8, cursor: "pointer", display: "flex", gap: 12, alignItems: "center", transition: "all 0.1s" }}
                      className="mp-dropdown-hover"
                    >
                      <img src={p.product.image} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: T.t1 }}>{p.product.name}</div>
                        <div style={{ fontSize: 11, color: T.t3 }}>Brand: {p.product.brand} · {p.shopCount} Sellers</div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: T.sky, fontFamily: FONT.mono }}>₹{p.bestPrice}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Categories & Shops in horizontal split if both exist */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {results.categories.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, color: T.t3, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", padding: "0 8px 8px" }}>Categories</div>
                    {results.categories.map(c => (
                      <div key={c} className="mp-dropdown-hover" style={{ padding: "6px 10px", borderRadius: 6, cursor: "pointer", fontSize: 13, color: T.t1, fontWeight: 600 }}>
                        📁 {c}
                      </div>
                    ))}
                  </div>
                )}
                {results.shops.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, color: T.t3, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", padding: "0 8px 8px" }}>Local Shops</div>
                    {results.shops.map(s => (
                      <div key={s.id} className="mp-dropdown-hover" style={{ padding: "6px 10px", borderRadius: 6, cursor: "pointer", fontSize: 13, color: T.t1, fontWeight: 600 }}>
                        🏪 {s.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
