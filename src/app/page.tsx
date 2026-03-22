import Link from 'next/link'
import { Fish, Truck, ShieldCheck, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-dvh">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="mx-auto w-full max-w-7xl flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Fish className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600 shrink-0" />
            <div>
              <span className="text-lg sm:text-xl font-bold text-blue-600">PICOMAR</span>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-none">
                Uniendo La Pampa y el Mar
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Ingresar</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="hidden sm:inline-flex">Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-5 sm:space-y-6 md:space-y-8">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs sm:text-sm">
              🐟 Más de 60 años de trayectoria
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Distribución mayorista de{' '}
              <span className="text-blue-600">productos del mar</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Realizá tus pedidos online de forma rápida y sencilla. Más de 200
              productos del mar con entrega en La Pampa, San Luis, Córdoba y
              Buenos Aires.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto px-6 md:px-8">
                  Registrate como cliente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 md:px-8">
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/50 py-10 sm:py-12 md:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center space-y-2 sm:space-y-3">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Fish className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <h3 className="text-xs sm:text-sm md:text-base font-semibold">200+ Productos</h3>
              <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground">
                Merluza, gatuzo, salmón, trucha y más
              </p>
            </div>

            <div className="text-center space-y-2 sm:space-y-3">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <h3 className="text-xs sm:text-sm md:text-base font-semibold">Entrega programada</h3>
              <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground">
                Días fijos por zona con camiones frigoríficos
              </p>
            </div>

            <div className="text-center space-y-2 sm:space-y-3">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <h3 className="text-xs sm:text-sm md:text-base font-semibold">Calidad garantizada</h3>
              <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground">
                60+ años de trayectoria impecable
              </p>
            </div>

            <div className="text-center space-y-2 sm:space-y-3">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <h3 className="text-xs sm:text-sm md:text-base font-semibold">Pedidos 24/7</h3>
              <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground">
                Pedí en cualquier momento y lugar
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 sm:py-8">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} PICOMAR® - Marca Registrada.
            Uniendo La Pampa y el Mar desde 1961.
          </p>
        </div>
      </footer>
    </div>
  )
}
