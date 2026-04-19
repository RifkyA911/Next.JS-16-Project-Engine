// Generate mock sales data for reports
export const generateMockSalesData = () => {
  const products = [
    "Laptop Pro 15", "Wireless Mouse", "USB-C Hub", "Mechanical Keyboard", "4K Monitor",
    "Webcam HD", "Desk Lamp LED", "Office Chair", "Standing Desk", "External SSD 1TB",
    "Bluetooth Speaker", "Noise Cancelling Headphones", "Smart Watch", "Fitness Tracker",
    "Power Bank 20000mAh", "Phone Case Premium", "Screen Protector", "Charging Cable",
    "Wireless Charger", "Tablet Stand", "Coffee Maker", "Water Bottle", "Backpack",
    "Sunglasses", "Wallet Leather", "Watch Analog", "Perfume", "Shampoo",
    "T-Shirt Cotton", "Jeans Denim", "Sneakers Sport", "Boots Leather", "Jacket Winter",
    "Scarf Wool", "Gloves Leather", "Hat Baseball", "Belt Canvas", "Socks Pack",
    "Book Programming", "Notebook Set", "Pen Set", "Pencil Case", "Highlighter Pack",
    "Sticky Notes", "Folder File", "Paper Clips", "Stapler", "Scissors"
  ];

  const categories = ["Electronics", "Office Supplies", "Clothing", "Accessories", "Books"];
  const regions = ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East"];
  const salesReps = [
    "John Smith", "Sarah Johnson", "Michael Brown", "Emily Davis", "Robert Wilson",
    "Lisa Anderson", "James Taylor", "Mary Thomas", "William Jackson", "Jennifer White"
  ];

  const salesData = products.map(product => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];
    const salesRep = salesReps[Math.floor(Math.random() * salesReps.length)];
    
    const unitsSold = Math.floor(Math.random() * 500) + 50;
    const unitPrice = Math.floor(Math.random() * 1000) + 50;
    const totalRevenue = unitsSold * unitPrice;
    const cost = unitPrice * 0.6; // 60% cost
    const profit = totalRevenue - (cost * unitsSold);
    const profitMargin = (profit / totalRevenue) * 100;

    return {
      id: `PROD-${Math.floor(Math.random() * 10000)}`,
      product,
      category,
      region,
      salesRep,
      unitsSold,
      unitPrice,
      totalRevenue,
      cost,
      profit,
      profitMargin,
      quarter: `Q${Math.floor(Math.random() * 4) + 1}`,
      year: 2024,
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Math.floor(Math.random() * 12)]
    };
  });

  return salesData;
};

export const mockSalesData = generateMockSalesData();

// Generate monthly revenue data for charts
export const generateMonthlyRevenue = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  return months.map(month => ({
    month,
    revenue: Math.floor(Math.random() * 100000) + 50000,
    orders: Math.floor(Math.random() * 500) + 200,
    customers: Math.floor(Math.random() * 1000) + 500,
    growth: Math.floor(Math.random() * 20) - 5 // -5% to +15%
  }));
};

export const monthlyRevenueData = generateMonthlyRevenue();

// Generate category performance data
export const generateCategoryPerformance = () => {
  const categories = ["Electronics", "Office Supplies", "Clothing", "Accessories", "Books"];
  
  return categories.map(category => ({
    category,
    revenue: Math.floor(Math.random() * 200000) + 100000,
    orders: Math.floor(Math.random() * 1000) + 500,
    growth: Math.floor(Math.random() * 30) - 10,
    topProduct: categories[Math.floor(Math.random() * categories.length)]
  }));
};

export const categoryPerformanceData = generateCategoryPerformance();

// Generate regional performance data
export const generateRegionalPerformance = () => {
  const regions = ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East"];
  
  return regions.map(region => ({
    region,
    revenue: Math.floor(Math.random() * 300000) + 150000,
    orders: Math.floor(Math.random() * 1500) + 750,
    customers: Math.floor(Math.random() * 2000) + 1000,
    growth: Math.floor(Math.random() * 25) - 5
  }));
};

export const regionalPerformanceData = generateRegionalPerformance();

// Generate top performers data
export const generateTopPerformers = () => {
  const salesReps = [
    "John Smith", "Sarah Johnson", "Michael Brown", "Emily Davis", "Robert Wilson",
    "Lisa Anderson", "James Taylor", "Mary Thomas", "William Jackson", "Jennifer White"
  ];
  
  return salesReps.slice(0, 5).map((rep, index) => ({
    rank: index + 1,
    name: rep,
    revenue: Math.floor(Math.random() * 150000) + 75000,
    orders: Math.floor(Math.random() * 800) + 400,
    customers: Math.floor(Math.random() * 1200) + 600,
    commission: Math.floor(Math.random() * 15000) + 7500
  }));
};

export const topPerformersData = generateTopPerformers();
