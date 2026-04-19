// Generate 1000 mock orders for demonstration (100 pages with 10 per page)
export const generateMockOrders = (count: number = 1000) => {
  const orders = [];
  const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  const customers = [
    "John Doe", "Jane Smith", "Michael Johnson", "Sarah Williams", "David Brown",
    "Emily Davis", "Robert Miller", "Lisa Wilson", "James Moore", "Mary Taylor",
    "William Anderson", "Jennifer Thomas", "Richard Jackson", "Linda White",
    "Joseph Harris", "Patricia Martin", "Thomas Thompson", "Barbara Garcia",
    "Charles Martinez", "Susan Robinson", "Christopher Clark", "Jessica Rodriguez",
    "Daniel Lewis", "Karen Lee", "Matthew Walker", "Nancy Hall", "Anthony Allen",
    "Betty Young", "Mark King", "Helen Wright", "Donald Scott", "Sandra Green",
    "Steven Adams", "Donna Baker", "Paul Nelson", "Ashley Carter", "Andrew Mitchell",
    "Kimberly Perez", "Joshua Roberts", "George Turner", "Emily Phillips", "Edward Campbell",
    "Amanda Parker", "Ronald Evans", "Melissa Collins", "Jason Stewart", "Stephanie Sanchez",
    "Jeffrey Morris", "Ryan Rogers", "Jacob Reed", "Gary Cook", "Henry Morgan",
    "Peter Bell", "Christian Murphy", "Walter Bailey", "Ryan Rivera", "Ethan Cooper",
    "Jeremy Richardson", "Harold Cox", "Keith Howard", "Carl Ward", "Terry Torres",
    "Robert Peterson", "Sean Gray", "Austin Ramirez", "Arthur James", "Lawrence Watson",
    "Jesse Brooks", "Dylan Kelly", "Bryan Sanders", "Joe Price", "Adam Bennett",
    "Henry Wood", "Peter Barnes", "Christian Ross", "Walter Henderson", "Ryan Coleman",
    "Ethan Jenkins", "Jeremy Perry", "Harold Powell", "Keith Long", "Carl Patterson",
    "Terry Hughes", "Robert Flores", "Sean Washington", "Austin Butler", "Arthur Simmons",
    "Lawrence Foster", "Jesse Gonzales", "Dylan Bryant", "Bryan Alexander", "Joe Russell"
  ];
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

  for (let i = 1; i <= count; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    const price = Math.floor(Math.random() * 1000) + 50;
    const total = price * quantity;
    
    orders.push({
      id: `ORD-${String(i).padStart(6, '0')}`,
      customer: customer,
      product: product,
      quantity: quantity,
      price: price,
      total: total,
      status: status,
      date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      email: customer.toLowerCase().replace(' ', '.') + '@example.com',
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      address: `${Math.floor(Math.random() * 9999) + 1} Main St, City, ST ${Math.floor(Math.random() * 90000) + 10000}`,
      paymentMethod: ["Credit Card", "PayPal", "Bank Transfer", "Cash on Delivery"][Math.floor(Math.random() * 4)],
      trackingNumber: status === "shipped" || status === "delivered" ? `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}` : null,
      notes: Math.random() > 0.7 ? ["Urgent delivery", "Gift wrap please", "Call before delivery", "Leave at door"][Math.floor(Math.random() * 4)] : null
    });
  }

  return orders;
};

export const mockOrders = generateMockOrders(1000);
