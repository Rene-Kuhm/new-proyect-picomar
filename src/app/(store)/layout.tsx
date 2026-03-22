import { auth } from '@/lib/auth'
import { StoreHeader } from '@/components/layout/store-header'

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <div className="min-h-screen flex flex-col">
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
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} PICOMAR® - Uniendo La Pampa y el
            Mar desde 1961.
          </p>
        </div>
      </footer>
    </div>
  )
}
