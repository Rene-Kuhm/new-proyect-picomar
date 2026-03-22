import Link from 'next/link'
import {
  Fish,
  Truck,
  ShieldCheck,
  Clock,
  ArrowRight,
  Thermometer,
  DollarSign,
  Users,
  MapPin,
  ShoppingCart,
  UserPlus,
  Package,
  Menu,
  Phone,
  Mail,
  ChevronRight,
  Waves,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* ───────────────────────── HEADER ───────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-500/25">
              <Fish className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
                PICOMAR
              </span>
              <p className="text-[9px] leading-none font-medium tracking-wider text-blue-600/70 uppercase sm:text-[10px]">
                Uniendo La Pampa y el Mar
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            <Link href="/catalogo">
              <Button variant="ghost" size="sm">
                Catálogo
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-sky-500 text-white hover:from-blue-700 hover:to-sky-600">
                Registrarse
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </nav>

          {/* Mobile nav */}
          <div className="flex items-center gap-1 md:hidden">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Ingresar
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-sky-500 text-white">
                Registro
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0">
          {/* Main gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-sky-50" />
          {/* Radial glow */}
          <div className="absolute top-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-sky-200/40 blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 h-[500px] w-[500px] rounded-full bg-blue-200/30 blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, #1e40af 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          {/* Wave shape at bottom */}
          <svg
            className="absolute bottom-0 left-0 w-full text-white"
            viewBox="0 0 1440 120"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0,64 C360,120 720,0 1080,64 C1260,96 1380,80 1440,64 L1440,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-2 text-sm font-medium text-blue-700 backdrop-blur-sm sm:mb-8">
              <Star className="h-4 w-4 fill-blue-500 text-blue-500" />
              <span>60+ años de trayectoria</span>
              <Star className="h-4 w-4 fill-blue-500 text-blue-500" />
            </div>

            {/* Heading */}
            <h1 className="mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
              Distribución mayorista de{' '}
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 bg-clip-text text-transparent">
                productos del mar
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-gray-600 sm:mb-10 sm:text-lg md:text-xl">
              Realizá tus pedidos online de forma rápida y sencilla. Más de 200
              productos frescos y congelados con entrega programada en{' '}
              <strong className="text-gray-700">La Pampa, San Luis, Córdoba y Buenos Aires</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="h-12 w-full bg-gradient-to-r from-blue-600 to-sky-500 px-8 text-base font-semibold text-white shadow-lg shadow-blue-500/30 hover:from-blue-700 hover:to-sky-600 hover:shadow-xl hover:shadow-blue-500/40 sm:w-auto"
                >
                  Registrate como cliente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/catalogo" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full border-gray-300 px-8 text-base font-semibold sm:w-auto"
                >
                  Ver catálogo
                </Button>
              </Link>
            </div>

            {/* Trust bar */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 sm:mt-12">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                Cadena de frío garantizada
              </span>
              <span className="hidden h-4 w-px bg-gray-300 sm:block" />
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-blue-500" />
                Entrega programada
              </span>
              <span className="hidden h-4 w-px bg-gray-300 sm:block" />
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-sky-500" />
                Pedidos 24/7
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── STATS ───────────────────────── */}
      <section className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 py-14 sm:py-16">
        {/* Pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12">
            {[
              { number: '60+', label: 'Años de trayectoria', sublabel: 'Desde 1961' },
              { number: '200+', label: 'Productos disponibles', sublabel: 'Del mar a tu comercio' },
              { number: '7', label: 'Zonas de entrega', sublabel: '4 provincias' },
              { number: '1000+', label: 'Clientes activos', sublabel: 'Confían en nosotros' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                  {stat.number}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-blue-100 sm:text-base">
                  {stat.label}
                </p>
                <p className="mt-0.5 text-xs text-blue-200/70 sm:text-sm">{stat.sublabel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── HOW IT WORKS ───────────────────────── */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <p className="mb-3 text-sm font-semibold tracking-wider text-blue-600 uppercase">
              Simple y rápido
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
              ¿Cómo funciona?
            </h2>
            <p className="mt-4 text-base text-gray-600 sm:text-lg">
              En tres simples pasos empezá a recibir productos del mar en tu comercio
            </p>
          </div>

          {/* Steps */}
          <div className="relative mx-auto max-w-4xl">
            {/* Connecting line (desktop only) */}
            <div className="absolute top-16 right-[16.67%] left-[16.67%] hidden h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 lg:block" />

            <div className="grid gap-8 sm:gap-10 lg:grid-cols-3 lg:gap-8">
              {[
                {
                  step: 1,
                  icon: UserPlus,
                  title: 'Registrate como comercio',
                  description:
                    'Creá tu cuenta en minutos con los datos de tu negocio. Nuestro equipo la activa en 24hs.',
                },
                {
                  step: 2,
                  icon: ShoppingCart,
                  title: 'Elegí tus productos',
                  description:
                    'Navegá el catálogo con más de 200 productos y armá tu pedido con precios mayoristas.',
                },
                {
                  step: 3,
                  icon: Truck,
                  title: 'Recibí en tu local',
                  description:
                    'Te lo llevamos el día programado para tu zona con cadena de frío garantizada.',
                },
              ].map((item) => (
                <div key={item.step} className="relative flex flex-col items-center text-center">
                  {/* Step number badge */}
                  <div className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-500/25 sm:h-16 sm:w-16">
                    <item.icon className="h-7 w-7 text-white sm:h-8 sm:w-8" />
                    <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-600 shadow-md ring-2 ring-blue-100">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">{item.title}</h3>
                  <p className="max-w-xs text-sm leading-relaxed text-gray-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── CATEGORIES ───────────────────────── */}
      <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <p className="mb-3 text-sm font-semibold tracking-wider text-blue-600 uppercase">
              Nuestros productos
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
              Categorías destacadas
            </h2>
            <p className="mt-4 text-base text-gray-600 sm:text-lg">
              Productos frescos y congelados de la más alta calidad
            </p>
          </div>

          {/* Category grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {[
              {
                emoji: '🐟',
                name: 'Pescados',
                description: 'Merluza, gatuzo, abadejo, lenguado y más variedad de mar',
                accent: 'from-blue-500 to-blue-600',
                bg: 'bg-blue-50',
              },
              {
                emoji: '🦐',
                name: 'Mariscos',
                description: 'Camarones, langostinos, calamar, pulpo y mejillones',
                accent: 'from-orange-500 to-red-500',
                bg: 'bg-orange-50',
              },
              {
                emoji: '🍣',
                name: 'Salmón y Trucha',
                description: 'Cortes premium frescos y ahumados de la Patagonia',
                accent: 'from-pink-500 to-rose-500',
                bg: 'bg-pink-50',
              },
              {
                emoji: '🍤',
                name: 'Empanados',
                description: 'Rabas, nuggets de merluza, bastones y medallones',
                accent: 'from-amber-500 to-yellow-500',
                bg: 'bg-amber-50',
              },
            ].map((category) => (
              <div
                key={category.name}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl sm:p-8"
              >
                {/* Gradient top bar */}
                <div
                  className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r ${category.accent} opacity-0 transition-opacity group-hover:opacity-100`}
                />

                <div className={`mb-4 inline-flex rounded-xl ${category.bg} p-3 sm:p-4`}>
                  <span className="text-3xl sm:text-4xl">{category.emoji}</span>
                </div>
                <h3 className="mb-1.5 text-base font-bold text-gray-900 sm:text-lg">
                  {category.name}
                </h3>
                <p className="text-xs leading-relaxed text-gray-500 sm:text-sm">
                  {category.description}
                </p>
                <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 sm:text-sm">
                  Ver productos
                  <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── COVERAGE ZONES ───────────────────────── */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <p className="mb-3 text-sm font-semibold tracking-wider text-blue-600 uppercase">
              Cobertura
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
              Llegamos a toda la región
            </h2>
            <p className="mt-4 text-base text-gray-600 sm:text-lg">
              Entregas programadas por zona con cadena de frío de principio a fin
            </p>
          </div>

          <div className="mx-auto max-w-5xl">
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {[
                { zone: 'Santa Rosa y Toay', days: 'Lunes y Jueves', province: 'La Pampa' },
                { zone: 'General Pico', days: 'Martes y Viernes', province: 'La Pampa' },
                { zone: 'Norte de La Pampa', days: 'Miércoles', province: 'La Pampa' },
                { zone: 'Sur de La Pampa', days: 'Jueves', province: 'La Pampa' },
                { zone: 'Sur de San Luis', days: 'Martes', province: 'San Luis' },
                { zone: 'Oeste de Buenos Aires', days: 'Miércoles', province: 'Buenos Aires' },
                { zone: 'Córdoba', days: 'Viernes', province: 'Córdoba' },
              ].map((zone) => (
                <div
                  key={zone.zone}
                  className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/50 sm:p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">{zone.zone}</h3>
                    <p className="mt-0.5 text-xs text-gray-500">{zone.province}</p>
                    <p className="mt-1.5 inline-flex rounded-full bg-blue-100/80 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {zone.days}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── WHY PICOMAR ───────────────────────── */}
      <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <p className="mb-3 text-sm font-semibold tracking-wider text-blue-600 uppercase">
              Nuestras ventajas
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
              ¿Por qué elegir PICOMAR?
            </h2>
            <p className="mt-4 text-base text-gray-600 sm:text-lg">
              Más de 60 años garantizando calidad, precio y servicio
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Thermometer,
                title: 'Cadena de frío garantizada',
                description:
                  'Desde el origen hasta tu comercio. Camiones frigoríficos con control de temperatura permanente.',
                color: 'text-cyan-600',
                bg: 'bg-cyan-50',
                ring: 'ring-cyan-100',
              },
              {
                icon: DollarSign,
                title: 'Precios mayoristas',
                description:
                  'Los mejores precios del mercado directo del productor. Sin intermediarios, con transparencia.',
                color: 'text-green-600',
                bg: 'bg-green-50',
                ring: 'ring-green-100',
              },
              {
                icon: Clock,
                title: 'Entrega puntual',
                description:
                  'Días fijos por zona para que siempre sepas cuándo llega tu pedido. Organización y puntualidad.',
                color: 'text-blue-600',
                bg: 'bg-blue-50',
                ring: 'ring-blue-100',
              },
              {
                icon: Users,
                title: 'Atención personalizada',
                description:
                  'Equipo dedicado que te asesora y acompaña. Conocemos tu negocio y tus necesidades.',
                color: 'text-purple-600',
                bg: 'bg-purple-50',
                ring: 'ring-purple-100',
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg sm:p-8"
              >
                <div
                  className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${benefit.bg} ring-1 ${benefit.ring}`}
                >
                  <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
                </div>
                <h3 className="mb-2 text-base font-bold text-gray-900 sm:text-lg">
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── CTA BANNER ───────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 py-16 sm:py-20">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/3 translate-y-1/3 rounded-full bg-sky-300/20 blur-3xl" />
          <svg
            className="absolute -bottom-1 left-0 w-full text-white opacity-5"
            viewBox="0 0 1440 200"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0,120 C240,180 480,60 720,120 C960,180 1200,60 1440,120 L1440,200 L0,200 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Waves className="mx-auto mb-6 h-10 w-10 text-blue-200" />
            <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
              ¿Listo para hacer tu primer pedido?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-blue-100 sm:text-lg">
              Unite a los más de 1000 comercios que ya confían en PICOMAR para abastecerse de
              productos del mar de la mejor calidad.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="h-12 w-full bg-white px-8 text-base font-semibold text-blue-700 shadow-lg hover:bg-blue-50 sm:w-auto"
                >
                  Registrate ahora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contacto" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full border-white/30 px-8 text-base font-semibold text-white hover:bg-white/10 hover:text-white sm:w-auto"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Contactanos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── FOOTER ───────────────────────── */}
      <footer className="border-t border-gray-200 bg-gray-900 text-gray-400">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-sky-400">
                  <Fish className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold text-white">PICOMAR</span>
                  <p className="text-[10px] leading-none font-medium tracking-wider text-blue-400 uppercase">
                    Uniendo La Pampa y el Mar
                  </p>
                </div>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-500">
                Distribución mayorista de productos del mar con más de 60 años de
                trayectoria en la región central de Argentina.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-300 uppercase">
                Navegación
              </h3>
              <ul className="space-y-3">
                {[
                  { label: 'Catálogo', href: '/catalogo' },
                  { label: 'Registrarse', href: '/register' },
                  { label: 'Iniciar Sesión', href: '/login' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coverage */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-300 uppercase">
                Cobertura
              </h3>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>La Pampa</li>
                <li>San Luis</li>
                <li>Córdoba</li>
                <li>Buenos Aires</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-300 uppercase">
                Contacto
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>(02954) XX-XXXX</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>ventas@picomar.com.ar</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>Santa Rosa, La Pampa</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 sm:flex-row">
            <p className="text-xs text-gray-600">
              &copy; {new Date().getFullYear()} PICOMAR® — Marca Registrada. Todos los derechos
              reservados.
            </p>
            <p className="text-xs text-gray-600">
              Uniendo La Pampa y el Mar desde 1961.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
