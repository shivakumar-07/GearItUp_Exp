// Simulated relational Database for 1M+ SKU scale architecture

export const VEHICLES = [
    { id: "v1", type: "Car", brand: "MG", model: "Hector", year: "2022", variant: "Sharp Pro" },
    { id: "v2", type: "Car", brand: "Toyota", model: "Innova", year: "2021", variant: "Crysta" },
    { id: "v3", type: "Car", brand: "Hyundai", model: "Creta", year: "2023", variant: "SX" },
    { id: "v4", type: "Bike", brand: "Honda", model: "Activa 125", year: "2020", variant: "Disc" },
    { id: "v5", type: "Bike", brand: "TVS", model: "Jupiter 125", year: "2022", variant: "Alloy" },
];

export const CATEGORIES = [
    "Brakes", "Engine", "Filters", "Suspension", "Electrical", "Accessories", "Body Parts"
];

// Master Catalog of products (Global level)
export const MASTER_PRODUCTS = [
    {
        id: "mp1",
        name: "Bosch Ceramic Brake Pads - Front",
        brand: "Bosch",
        category: "Brakes",
        sku: "BSH-BRK-001",
        compatibility: ["v1", "v3"], // Fits Hector & Creta
        description: "Premium ceramic brake pads with low dust and noise.",
        specifications: { weight: "1.2kg", material: "Ceramic", warranty: "1 Year" },
        image: "https://images.unsplash.com/photo-1600705357388-75211dcdb66f?auto=format&fit=crop&q=80&w=200&h=200",
        global_sales_velocity: 840,
        created_at: "2023-01-10T00:00:00Z"
    },
    {
        id: "mp2",
        name: "NGK Iridium Spark Plug Set",
        brand: "NGK",
        category: "Electrical",
        sku: "NGK-IR-4",
        compatibility: ["v2", "v3"], // Fits Innova & Creta
        description: "Laser Iridium spark plugs for maximum performance.",
        specifications: { weight: "200g", material: "Iridium", warranty: "2 Years" },
        image: "https://images.unsplash.com/photo-1549488344-c7ef21a416a2?auto=format&fit=crop&q=80&w=200&h=200",
        global_sales_velocity: 1250,
        created_at: "2023-02-15T00:00:00Z"
    },
    {
        id: "mp3",
        name: "Motul 300V Fully Synthetic Engine Oil (1L)",
        brand: "Motul",
        category: "Engine",
        sku: "MTL-300V-1L",
        compatibility: ["v4", "v5"], // Fits Bikes
        description: "Full synthetic oil formulated for race & street.",
        specifications: { weight: "1kg", volume: "1 Litre", type: "Fully Synthetic" },
        image: "https://images.unsplash.com/photo-1616428781489-082260f723ea?auto=format&fit=crop&q=80&w=200&h=200",
        global_sales_velocity: 2400,
        created_at: "2022-11-20T00:00:00Z"
    },
    {
        id: "mp4",
        name: "Monroe Front Shock Absorber",
        brand: "Monroe",
        category: "Suspension",
        sku: "MNR-SHK-F",
        compatibility: ["v1"], // Fits Hector only
        description: "Gas charged MacPherson strut for smooth ride.",
        specifications: { weight: "3.5kg", position: "Front", warranty: "3 Years" },
        image: "https://images.unsplash.com/photo-1611082590217-06df31b997c2?auto=format&fit=crop&q=80&w=200&h=200",
        global_sales_velocity: 320,
        created_at: "2023-05-12T00:00:00Z"
    },
    {
        id: "mp5",
        name: "Purolator Cabin AC Filter",
        brand: "Purolator",
        category: "Filters",
        sku: "PUR-CAB-01",
        compatibility: ["v1", "v2", "v3"], // Fits all cars
        description: "Activated carbon AC filter for clean air.",
        specifications: { weight: "300g", type: "Activated Carbon" },
        image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=200&h=200",
        global_sales_velocity: 1800,
        created_at: "2023-08-01T00:00:00Z"
    }
];

// Shops participating in marketplace
export const SHOPS = [
    { id: "s1", name: "Ravi Auto Parts", lat: 17.3850, lng: 78.4867, rating: 4.8, reviews: 340, is_featured: true, delivery_radius: 15 },
    { id: "s2", name: "Balaji Spares", lat: 17.4121, lng: 78.4326, rating: 4.5, reviews: 120, is_featured: false, delivery_radius: 10 },
    { id: "s3", name: "Mechanic Hub", lat: 17.4444, lng: 78.4900, rating: 4.2, reviews: 85, is_featured: false, delivery_radius: 5 }
];

// Individual Shop Inventory Listings (Link MP to Shop)
export const SHOP_INVENTORY = [
    { shop_id: "s1", product_id: "mp1", selling_price: 2400, buying_price: 1800, discount: 10, stock_quantity: 12, min_stock: 5, delivery_time: "Same Day", total_sales: 140 },
    { shop_id: "s2", product_id: "mp1", selling_price: 2600, buying_price: 1850, discount: 0, stock_quantity: 4, min_stock: 5, delivery_time: "Target: 2 days", total_sales: 45 },

    { shop_id: "s1", product_id: "mp2", selling_price: 1200, buying_price: 900, discount: 5, stock_quantity: 30, min_stock: 10, delivery_time: "Same Day", total_sales: 400 },
    { shop_id: "s3", product_id: "mp2", selling_price: 1150, buying_price: 880, discount: 0, stock_quantity: 0, min_stock: 10, delivery_time: "Out of Stock", total_sales: 60 },

    { shop_id: "s2", product_id: "mp3", selling_price: 950, buying_price: 700, discount: 15, stock_quantity: 50, min_stock: 20, delivery_time: "Same Day", total_sales: 800 },
    { shop_id: "s3", product_id: "mp3", selling_price: 1000, buying_price: 710, discount: 0, stock_quantity: 25, min_stock: 10, delivery_time: "Next Day", total_sales: 300 },

    { shop_id: "s1", product_id: "mp4", selling_price: 4500, buying_price: 3600, discount: 5, stock_quantity: 8, min_stock: 4, delivery_time: "Same Day", total_sales: 40 },

    { shop_id: "s1", product_id: "mp5", selling_price: 450, buying_price: 280, discount: 0, stock_quantity: 45, min_stock: 15, delivery_time: "Same Day", total_sales: 230 },
    { shop_id: "s2", product_id: "mp5", selling_price: 400, buying_price: 260, discount: 10, stock_quantity: 15, min_stock: 10, delivery_time: "Next Day", total_sales: 110 },
    { shop_id: "s3", product_id: "mp5", selling_price: 420, buying_price: 270, discount: 0, stock_quantity: 6, min_stock: 10, delivery_time: "Same Day", total_sales: 85 }
];
