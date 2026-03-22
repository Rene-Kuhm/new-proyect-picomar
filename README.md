# PICOMAR - Plataforma B2B de Productos del Mar

> Plataforma de venta mayorista online para PICOMAR, empresa marplatense de pesca y subpescada.

## 🇦🇷 Sobre PICOMAR

**PICOMAR** es una empresa fundada ~1961 en Mar del Plata, Buenos Aires, Argentina. 

- **Slogan**: "Uniendo La Pampa y el Mar"
- **Especialidad**: Venta mayorista de pescados y mariscos frescos/congelados
- **Modelo**: B2B (solo venta a comercios/minoristas, no consumidor final)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Base de datos**: PostgreSQL (Neon)
- ** ORM**: Prisma
- **Autenticación**: NextAuth.js v5
- **UI**: Shadcn/ui + Tailwind CSS
- **Deployment**: Vercel

## 🚀 Getting Started

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu configuración

# Generar cliente Prisma
npx prisma generate

# Push a base de datos
npx prisma db push

# Levantar desarrollo
npm run dev
```

## 📁 Estructura del Proyecto

```
src/
├── app/           # Routes y páginas (App Router)
├── components/    # Componentes React
├── lib/           # Utilidades y configuraciones
└── prisma/        # Schema y migrations
```

## 📝 Licencia

Propiedad de PICOMAR - Mar del Plata, Argentina