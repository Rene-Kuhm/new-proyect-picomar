// Re-export Prisma types for convenience
export type {
  User,
  Product,
  Category,
  Order,
  OrderItem,
  Payment,
  DeliveryZone,
  StockMovement,
} from '@/generated/prisma'

export {
  UserRole,
  UserStatus,
  ProductUnit,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  DayOfWeek,
  StockMovementType,
} from '@/generated/prisma'

// Cart types (client-side, no DB)
export interface CartItem {
  productId: string
  productName: string
  productSlug: string
  price: number
  unit: string
  quantity: number
  imageUrl: string | null
  minOrderQty: number
  stock: number
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pagination
export interface PaginationParams {
  page: number
  limit: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Dashboard stats
export interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  totalClients: number
  lowStockProducts: number
  recentOrders: Order[]
}
