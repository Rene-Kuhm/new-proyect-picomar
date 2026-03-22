import Link from 'next/link'
import { Fish, Truck, ShieldCheck, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Fish className="h-8 w-8 text-blue-600" />
            <div>
              <span className="text-xl font-bold text-blue-600">PICOMAR</span>
              <p className="text-[10px] text-muted-foreground leading-none">
                Uniendo La Pampa y el Mar
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center">
        <div className="container py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
              🐟 Más de 60 años de trayectoria
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Distribución mayorista de{' '}
              <span className="text-blue-600">productos del mar</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Realizá tus pedidos online de forma rápida y sencilla. Más de 200
              productos del mar con entrega en La Pampa, San Luis, Córdoba y
              Buenos Aires.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8">
                <Link href="/register">
                  Registrate como cliente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link href="/login">Ya tengo cuenta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Fish className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">200+ Productos</h3>
              <p className="text-sm text-muted-foreground">
                Merluza, gatuzo, salmón, trucha, empanados y mucho más
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Entrega programada</h3>
              <p className="text-sm text-muted-foreground">
                Días fijos de entrega por zona con camiones frigoríficos
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Calidad garantizada</h3>
              <p className="text-sm text-muted-foreground">
                60+ años de trayectoria impecable en el rubro
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Pedidos 24/7</h3>
              <p className="text-sm text-muted-foreground">
                Realizá tu pedido en cualquier momento desde cualquier lugar
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} PICOMAR® - Marca Registrada.
            Uniendo La Pampa y el Mar desde 1961.
          </p>
        </div>
      </footer>
    </div>
  )
}
