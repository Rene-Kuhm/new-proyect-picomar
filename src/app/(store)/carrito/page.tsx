'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart()

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
        <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Tu carrito está vacío</h1>
        <p className="text-sm sm:text-base text-muted-foreground mb-6">
          Agregá productos desde el catálogo para armar tu pedido
        </p>
        <Link href="/catalogo">
          <Button>Ver Catálogo</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Carrito de Pedido</h1>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {cart.items.map((item) => (
            <div key={item.productId} className="rounded-xl border bg-white p-3 sm:p-4">
              {/* Mobile: stacked layout */}
              <div className="flex gap-3 sm:gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="text-xl sm:text-2xl">🐟</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold truncate">{item.productName}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        ${item.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })} / {item.unit}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="shrink-0 p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Quantity + subtotal */}
                  <div className="flex items-center justify-between mt-2 sm:mt-3">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                        className="w-14 sm:w-20 text-center h-7 sm:h-8 text-xs sm:text-sm"
                        min={item.minOrderQty}
                        max={item.stock}
                        step={0.5}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm sm:text-base font-bold">
                      ${(item.price * item.quantity).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={clearCart} className="text-red-600 text-xs sm:text-sm">
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            Vaciar carrito
          </Button>
        </div>

        {/* Summary */}
        <div>
          <div className="rounded-xl border bg-white p-4 sm:p-5 sticky top-20 space-y-4">
            <h2 className="text-base sm:text-lg font-bold">Resumen del Pedido</h2>
            <div className="space-y-2">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground truncate mr-2">
                    {item.productName} x{item.quantity}
                  </span>
                  <span className="shrink-0">
                    ${(item.price * item.quantity).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-base sm:text-lg">
              <span>Total</span>
              <span className="text-blue-600">
                ${cart.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <Link href="/checkout" className="block">
              <Button className="w-full h-10 sm:h-11" size="lg">
                Continuar al Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
