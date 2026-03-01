import { useState, useEffect, useCallback } from "react";
import { SEED_PRODUCTS, genSeededMovements } from "./utils";

export function useStore() {
    const [products, setP] = useState(null);
    const [movements, setM] = useState(null);
    const [loaded, setL] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                // Since window.storage might not exist in vanilla Vite, we fallback to localStorage
                const storedProducts = localStorage.getItem("inv_products_v4");
                const storedMovements = localStorage.getItem("inv_movements_v4");

                setP(storedProducts ? JSON.parse(storedProducts) : SEED_PRODUCTS);
                setM(storedMovements ? JSON.parse(storedMovements) : genSeededMovements());
            } catch {
                setP(SEED_PRODUCTS);
                setM(genSeededMovements());
            }
            setL(true);
        })();
    }, []);

    const saveProducts = useCallback(async d => { setP(d); try { localStorage.setItem("inv_products_v4", JSON.stringify(d)); } catch { } }, []);
    const saveMovements = useCallback(async d => { setM(d); try { localStorage.setItem("inv_movements_v4", JSON.stringify(d)); } catch { } }, []);
    const resetAll = useCallback(async () => {
        const p = SEED_PRODUCTS; const m = genSeededMovements();
        setP(p); setM(m);
        try { localStorage.setItem("inv_products_v4", JSON.stringify(p)); localStorage.setItem("inv_movements_v4", JSON.stringify(m)); } catch { }
    }, []);

    return { products, movements, saveProducts, saveMovements, resetAll, loaded };
}
