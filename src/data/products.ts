export type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
};

// Generate more products for pagination testing
const generateProducts = (): Product[] => {
  const baseProducts = [
    {
      id: '1',
      title: 'iPhone 15 Pro',
      price: 999,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
      description: 'Latest iPhone with advanced camera system',
      category: 'Electronics',
    },
    {
      id: '2',
      title: 'MacBook Air M2',
      price: 1199,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
      description: 'Ultra-thin laptop with M2 chip',
      category: 'Electronics',
    },
    {
      id: '3',
      title: 'AirPods Pro',
      price: 249,
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=300&fit=crop',
      description: 'Wireless earbuds with noise cancellation',
      category: 'Electronics',
    },
    {
      id: '4',
      title: 'Nike Air Max',
      price: 120,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
      description: 'Comfortable running shoes',
      category: 'Fashion',
    },
    {
      id: '5',
      title: 'Samsung Galaxy S24',
      price: 799,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
      description: 'Android smartphone with AI features',
      category: 'Electronics',
    },
    {
      id: '6',
      title: 'Wireless Charger',
      price: 39,
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop',
      description: 'Fast wireless charging pad',
      category: 'Accessories',
    },
    {
      id: '7',
      title: 'Bluetooth Speaker',
      price: 89,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
      description: 'Portable speaker with great sound quality',
      category: 'Electronics',
    },
    {
      id: '8',
      title: 'Smart Watch',
      price: 299,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      description: 'Fitness tracking and notifications',
      category: 'Electronics',
    },
  ];

  // Generate additional products for pagination
  const additionalProducts: Product[] = [];
  const categories = ['Electronics', 'Fashion', 'Accessories', 'Home', 'Sports'];
  const titles = [
    'Gaming Headset', 'Laptop Stand', 'Phone Case', 'Tablet', 'Camera',
    'Headphones', 'Keyboard', 'Mouse', 'Monitor', 'Webcam',
    'Desk Lamp', 'Coffee Mug', 'Water Bottle', 'Backpack', 'Wallet',
    'Sunglasses', 'Hat', 'T-Shirt', 'Jeans', 'Sneakers',
    'Dumbbells', 'Yoga Mat', 'Tennis Racket', 'Basketball', 'Soccer Ball'
  ];

  // Real working image URLs for additional products
  const imageUrls = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop', // Headphones
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop', // Laptop Stand
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300&h=300&fit=crop', // Phone Case
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop', // Tablet
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=300&fit=crop', // Camera
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop', // Wireless Charger
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop', // Speaker
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop', // Smart Watch
    'https://images.unsplash.com/photo-1527814050087-379e84706e88?w=300&h=300&fit=crop', // Keyboard
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop', // Mouse
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3a04?w=300&h=300&fit=crop', // Monitor
    'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=300&h=300&fit=crop', // Webcam
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop', // Desk Lamp
    'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=300&h=300&fit=crop', // Coffee Mug
    'https://images.unsplash.com/photo-1523362628742-d49a9d9a5f2e?w=300&h=300&fit=crop', // Water Bottle
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop', // Backpack
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop', // Wallet
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&h=300&fit=crop', // Sunglasses
    'https://images.unsplash.com/photo-1521369909029-2afed882ba53?w=300&h=300&fit=crop', // Hat
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop', // T-Shirt
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop', // Jeans
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop', // Sneakers
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop', // Dumbbells
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop', // Yoga Mat
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop', // Tennis Racket
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=300&fit=crop', // Basketball
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=300&h=300&fit=crop', // Soccer Ball
  ];

  for (let i = 9; i <= 50; i++) {
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomPrice = Math.floor(Math.random() * 1000) + 10;
    const randomImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];
    
    additionalProducts.push({
      id: i.toString(),
      title: `${randomTitle} ${i}`,
      price: randomPrice,
      image: randomImage,
      description: `High-quality ${randomTitle.toLowerCase()} for everyday use`,
      category: randomCategory,
    });
  }

  return [...baseProducts, ...additionalProducts];
};

export const mockProducts: Product[] = generateProducts();

// Pagination helper functions
export const ITEMS_PER_PAGE = 8;

export const getProductsPage = (page: number, itemsPerPage: number = ITEMS_PER_PAGE): Product[] => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return mockProducts.slice(startIndex, endIndex);
};

export const getTotalPages = (itemsPerPage: number = ITEMS_PER_PAGE): number => {
  return Math.ceil(mockProducts.length / itemsPerPage);
};
