import { VEHICLES, MASTER_PRODUCTS, SHOPS, SHOP_INVENTORY, CATEGORIES } from "./mockDatabase";

// -----------------------------------------------------
// GEO-LOCATION MOCK (Haversine Formula Simulation)
// -----------------------------------------------------
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}

const USER_LAT = 17.4000;
const USER_LNG = 78.4500;

export const getNearDistance = (shop) => {
  return getDistanceFromLatLonInKm(USER_LAT, USER_LNG, shop.lat, shop.lng).toFixed(1);
};


// -----------------------------------------------------
// RANKING ENGINE
// Score = (compatibility_match * 0.4) + (sales_velocity * 0.2) + (rating * 0.15) + (proximity * 0.15) + (stock_health * 0.1)
// -----------------------------------------------------
export const rankingEngine = (masterProducts, vehicleId = null) => {
  return masterProducts.map(mp => {
    // Determine compatibility
    const exactMatch = vehicleId && mp.compatibility.includes(vehicleId) ? 100 : 0;
    
    // Attach shop data
    const listings = SHOP_INVENTORY.filter(inv => inv.product_id === mp.id)
      .map(inv => {
        const shop = SHOPS.find(s => s.id === inv.shop_id);
        const dist = parseFloat(getNearDistance(shop));
        return { ...inv, shop, distance: dist };
      })
      .filter(l => l.distance <= l.shop.delivery_radius) // Only shops that deliver here
      .sort((a,b) => a.selling_price - b.selling_price); // Sort lowest price first

    if (listings.length === 0) return null; // Not available near user

    const bestListing = listings[0];
    
    // Velocity Score (Normalized out of 3000 max sales proxy)
    const velocityScore = Math.min((mp.global_sales_velocity / 3000) * 100, 100);
    
    // Rating Score (from the shop selling it cheapest)
    const ratingScore = (bestListing.shop.rating / 5) * 100;
    
    // Proximity Score (Closer is better, max 15km)
    const proxScore = Math.max(0, 100 - (bestListing.distance / 15 * 100));

    // Stock Health (In stock = 100, Low stock = 50, Out = 0)
    let stockScore = 0;
    if (bestListing.stock_quantity > bestListing.min_stock) stockScore = 100;
    else if (bestListing.stock_quantity > 0) stockScore = 50;

    // Calculate Final Weighted Rank
    let rankScore = 0;
    if (vehicleId) {
      rankScore = (exactMatch * 0.4) + (velocityScore * 0.2) + (ratingScore * 0.15) + (proxScore * 0.15) + (stockScore * 0.1);
    } else {
      // If no vehicle selected, compatibility is ignored, weight redistributed
      rankScore = (velocityScore * 0.4) + (ratingScore * 0.3) + (proxScore * 0.2) + (stockScore * 0.1);
    }

    return {
      product: mp,
      listings,
      bestPrice: bestListing.selling_price,
      availability: listings.reduce((sum, l) => sum + l.stock_quantity, 0),
      shopCount: listings.length,
      fastestEta: [...listings].sort((a,b)=> (a.delivery_time==="Same Day"?-1:1))[0].delivery_time,
      rankScore: parseFloat(rankScore.toFixed(2)),
      isCompatible: exactMatch === 100
    };
  }).filter(Boolean).sort((a, b) => b.rankScore - a.rankScore);
};

// -----------------------------------------------------
// GET HOME PAGE DATA
// -----------------------------------------------------
export const getHomeData = (vehicleId = null) => {
  const allRanked = rankingEngine(MASTER_PRODUCTS, vehicleId);

  // If vehicle selected, just return matching products
  if (vehicleId) {
    return {
      compatibleParts: allRanked.filter(p => p.isCompatible)
    };
  }

  // If NO vehicle selected, return dynamic sections
  return {
    topSelling: [...allRanked].sort((a,b) => b.product.global_sales_velocity - a.product.global_sales_velocity).slice(0, 10),
    trendingNearYou: [...allRanked].sort((a,b) => a.listings[0].distance - b.listings[0].distance).slice(0, 10),
    bestDeals: [...allRanked].sort((a,b) => b.listings[0].discount - a.listings[0].discount).filter(p => p.listings[0].discount > 0).slice(0, 5),
    popularCategories: CATEGORIES.slice(0, 6)
  };
};

// -----------------------------------------------------
// SEARCH ENGINE (Indexed Autocomplete Mock)
// -----------------------------------------------------
export const searchEngine = (query, vehicleId = null) => {
  if (!query || query.length < 2) return { products: [], categories: [], shops: [] };
  
  const q = query.toLowerCase();
  
  // 1. Matches on Categories
  const categories = CATEGORIES.filter(c => c.toLowerCase().includes(q));

  // 2. Matches on Shops
  const shops = SHOPS.filter(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));

  // 3. Matches on Products
  let productMatches = MASTER_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.brand.toLowerCase().includes(q) || 
    p.sku.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );

  // Process through ranking to format output
  let products = rankingEngine(productMatches, vehicleId);

  return {
    products: products.slice(0, 5), // Return top 5 matches
    categories,
    shops
  };
};
