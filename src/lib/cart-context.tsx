'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { CartItem, Cart } from '@/types'
import { toast } from 'sonner'

interface CartContextType {
  cart: Cart
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_KEY = 'picomar-cart'

function calculateCart(items: CartItem[]): Cart {
  return {
    items,
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    itemCount: items.length,
  }
}

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const saved = localStorage.getItem(CART_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setItems(loadCart())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) saveCart(items)
  }, [items, mounted])

  const addItem = useCallback(
    (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === newItem.productId)
        const qty = newItem.quantity || newItem.minOrderQty || 1

        if (existing) {
          const newQty = existing.quantity + qty
          if (newQty > existing.stock) {
            toast.error(`Stock insuficiente. Disponible: ${existing.stock}`)
            return prev
          }
          toast.success(`${newItem.productName} actualizado en el carrito`)
          return prev.map((i) =>
            i.productId === newItem.productId ? { ...i, quantity: newQty } : i
          )
        }

        toast.success(`${newItem.productName} agregado al carrito`)
        return [...prev, { ...newItem, quantity: qty } as CartItem]
      })
    },
    []
  )

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      setItems((prev) => {
        const item = prev.find((i) => i.productId === productId)
        if (!item) return prev

        if (quantity <= 0) {
          return prev.filter((i) => i.productId !== productId)
        }

        if (quantity < item.minOrderQty) {
          toast.error(`Cantidad mínima: ${item.minOrderQty}`)
          return prev
        }

        if (quantity > item.stock) {
          toast.error(`Stock insuficiente. Disponible: ${item.stock}`)
          return prev
        }

        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity } : i
        )
      })
    },
    []
  )

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
    toast.success('Producto eliminado del carrito')
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const cart = calculateCart(items)

  return (
    <CartContext.Provider
      value={{ cart, addItem, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
