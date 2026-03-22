import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { hash } from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Create delivery zones
  const zones = await Promise.all([
    prisma.deliveryZone.create({
      data: {
        name: 'Santa Rosa',
        description: 'Santa Rosa y alrededores',
        deliveryDays: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
        sortOrder: 1,
      },
    }),
    prisma.deliveryZone.create({
      data: {
        name: 'General Pico',
        description: 'General Pico y norte provincial',
        deliveryDays: ['TUESDAY', 'THURSDAY'],
        sortOrder: 2,
      },
    }),
    prisma.deliveryZone.create({
      data: {
        name: 'Toay - Anguil',
        description: 'Toay, Anguil y localidades cercanas',
        deliveryDays: ['MONDAY', 'THURSDAY'],
        sortOrder: 3,
      },
    }),
    prisma.deliveryZone.create({
      data: {
        name: 'Sur de La Pampa',
        description: 'Zona sur de la provincia',
        deliveryDays: ['WEDNESDAY'],
        sortOrder: 4,
      },
    }),
    prisma.deliveryZone.create({
      data: {
        name: 'San Luis',
        description: 'Sur de San Luis',
        deliveryDays: ['TUESDAY'],
        sortOrder: 5,
      },
    }),
    prisma.deliveryZone.create({
      data: {
        name: 'Córdoba',
        description: 'Zona sur de Córdoba',
        deliveryDays: ['WEDNESDAY'],
        sortOrder: 6,
      },
    }),
    prisma.deliveryZone.create({
      data: {
        name: 'Oeste Buenos Aires',
        description: '9 de Julio, Olavarría, Bolívar',
        deliveryDays: ['THURSDAY'],
        sortOrder: 7,
      },
    }),
  ])

  console.log(`✅ Created ${zones.length} delivery zones`)

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Filetes',
        slug: 'filetes',
        description: 'Filetes de pescado sin espinas',
        order: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Pescado Entero',
        slug: 'pescado-entero',
        description: 'Pescados enteros frescos y congelados',
        order: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Mariscos',
        slug: 'mariscos',
        description: 'Mariscos y frutos de mar',
        order: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Empanados y Rebozados',
        slug: 'empanados-rebozados',
        description: 'Milanesas, rabas, empanados listos para cocinar',
        order: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Premium',
        slug: 'premium',
        description: 'Salmón, trucha y productos premium',
        order: 5,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Conservas',
        slug: 'conservas',
        description: 'Conservas y enlatados de pescado',
        order: 6,
      },
    }),
  ])

  console.log(`✅ Created ${categories.length} categories`)

  // Create sample products
  const products = [
    { name: 'Filet de Merluza', sku: 'FIL-MER-001', price: 4500, unit: 'KG', categoryIdx: 0, stock: 500, featured: true },
    { name: 'Filet de Gatuzo', sku: 'FIL-GAT-001', price: 5200, unit: 'KG', categoryIdx: 0, stock: 300, featured: true },
    { name: 'Filet de Lenguado', sku: 'FIL-LEN-001', price: 7800, unit: 'KG', categoryIdx: 0, stock: 150 },
    { name: 'Filet de Abadejo', sku: 'FIL-ABA-001', price: 4800, unit: 'KG', categoryIdx: 0, stock: 200 },
    { name: 'Merluza Entera', sku: 'ENT-MER-001', price: 2800, unit: 'KG', categoryIdx: 1, stock: 400 },
    { name: 'Pejerrey', sku: 'ENT-PEJ-001', price: 3200, unit: 'KG', categoryIdx: 1, stock: 250 },
    { name: 'Corvina', sku: 'ENT-COR-001', price: 3500, unit: 'KG', categoryIdx: 1, stock: 200 },
    { name: 'Camarones Pelados', sku: 'MAR-CAM-001', price: 12000, unit: 'KG', categoryIdx: 2, stock: 100, featured: true },
    { name: 'Langostinos', sku: 'MAR-LAN-001', price: 15000, unit: 'KG', categoryIdx: 2, stock: 80 },
    { name: 'Anillos de Calamar', sku: 'MAR-CAL-001', price: 6500, unit: 'KG', categoryIdx: 2, stock: 150 },
    { name: 'Mejillones', sku: 'MAR-MEJ-001', price: 4200, unit: 'KG', categoryIdx: 2, stock: 120 },
    { name: 'Milanesa de Merluza Sin Espinas', sku: 'EMP-MIL-001', price: 5800, unit: 'KG', categoryIdx: 3, stock: 400, featured: true },
    { name: 'Rabas Rebozadas', sku: 'EMP-RAB-001', price: 7200, unit: 'KG', categoryIdx: 3, stock: 200 },
    { name: 'Bastones de Merluza', sku: 'EMP-BAS-001', price: 5500, unit: 'BOX', categoryIdx: 3, stock: 300 },
    { name: 'Empanadas de Atún x12', sku: 'EMP-EAT-001', price: 4800, unit: 'BOX', categoryIdx: 3, stock: 150 },
    { name: 'Nuggets de Pescado', sku: 'EMP-NUG-001', price: 5000, unit: 'BOX', categoryIdx: 3, stock: 250 },
    { name: 'Salmón Rosado', sku: 'PRE-SAL-001', price: 18000, unit: 'KG', categoryIdx: 4, stock: 60, featured: true },
    { name: 'Trucha Arco Iris', sku: 'PRE-TRU-001', price: 14000, unit: 'KG', categoryIdx: 4, stock: 80, featured: true },
    { name: 'Salmón Ahumado', sku: 'PRE-SAH-001', price: 22000, unit: 'KG', categoryIdx: 4, stock: 40 },
    { name: 'Atún en Aceite x24', sku: 'CON-ATU-001', price: 36000, unit: 'BOX', categoryIdx: 5, stock: 100 },
    { name: 'Caballa en Aceite x24', sku: 'CON-CAB-001', price: 28000, unit: 'BOX', categoryIdx: 5, stock: 80 },
    { name: 'Sardinas x24', sku: 'CON-SAR-001', price: 24000, unit: 'BOX', categoryIdx: 5, stock: 120 },
  ]

  function slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: slugify(p.name),
        sku: p.sku,
        price: p.price,
        unit: p.unit as 'KG' | 'UNIT' | 'BOX' | 'PACK',
        categoryId: categories[p.categoryIdx].id,
        stock: p.stock,
        minOrderQty: p.unit === 'KG' ? 5 : 1,
        lowStockAlert: p.unit === 'KG' ? 50 : 10,
        isFeatured: p.featured || false,
      },
    })
  }

  console.log(`✅ Created ${products.length} products`)

  // Create admin user
  const adminPassword = await hash('admin123', 12)
  await prisma.user.create({
    data: {
      email: 'admin@picomar.com.ar',
      password: adminPassword,
      role: 'ADMIN',
      status: 'APPROVED',
      businessName: 'PICOMAR Administración',
      cuit: '30-12345678-9',
      phone: '2954-000000',
      address: 'Santa Rosa, La Pampa',
      city: 'Santa Rosa',
      province: 'La Pampa',
      zoneId: zones[0].id,
    },
  })

  console.log('✅ Created admin user: admin@picomar.com.ar / admin123')

  // Create sample client
  const clientPassword = await hash('cliente123', 12)
  await prisma.user.create({
    data: {
      email: 'cliente@ejemplo.com',
      password: clientPassword,
      role: 'CLIENT',
      status: 'APPROVED',
      businessName: 'Pescadería El Puerto',
      cuit: '20-87654321-0',
      phone: '2954-111111',
      address: 'Av. San Martín 1234',
      city: 'Santa Rosa',
      province: 'La Pampa',
      zoneId: zones[0].id,
    },
  })

  console.log('✅ Created sample client: cliente@ejemplo.com / cliente123')

  console.log('\n🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
