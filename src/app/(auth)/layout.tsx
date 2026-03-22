import { Fish } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/50 p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Fish className="h-10 w-10 text-blue-600" />
        <div>
          <span className="text-2xl font-bold text-blue-600">PICOMAR</span>
          <p className="text-xs text-muted-foreground">
            Uniendo La Pampa y el Mar
          </p>
        </div>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
