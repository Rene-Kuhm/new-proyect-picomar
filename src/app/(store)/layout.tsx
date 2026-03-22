import { auth } from '@/lib/auth'
import { StoreHeader } from '@/components/layout/store-header'
import { CartProvider } from '@/lib/cart-context'

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <CartProvider>
      <div className="min-h-dvh flex flex-col">
        <StoreHeader
          user={
            session?.user
              ? {
                  businessName: session.user.businessName,
                  role: session.user.role,
                }
              : null
          }
        />
        <main className="flex-1">{children}</main>
        <footer className="border-t py-6">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} PICOMAR® - Uniendo La Pampa y el
              Mar desde 1961.
            </p>
          </div>
        </footer>
      </div>
    </CartProvider>
  )
}
