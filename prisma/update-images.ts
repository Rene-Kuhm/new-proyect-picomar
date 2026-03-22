import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

// Real seafood images from Unsplash (free to use)
const productImages: Record<string, string> = {
  // Filetes
  'filet-de-merluza': 'https://images.unsplash.com/photo-1510130113356-d9eff9b89e38?w=600&h=600&fit=crop',
  'filet-de-gatuzo': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=600&fit=crop',
  'filet-de-lenguado': 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=600&h=600&fit=crop',
  'filet-de-abadejo': 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=600&h=600&fit=crop',

  // Pescado entero
  'merluza-entera': 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=600&h=600&fit=crop',
  'pejerrey': 'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?w=600&h=600&fit=crop',
  'corvina': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=600&fit=crop',

  // Mariscos
  'camarones-pelados': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&h=600&fit=crop',
  'langostinos': 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=600&h=600&fit=crop',
  'anillos-de-calamar': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=600&fit=crop',
  'mejillones': 'https://images.unsplash.com/photo-1590759668628-05b0fc34bb70?w=600&h=600&fit=crop',

  // Empanados
  'milanesa-de-merluza-sin-espinas': 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=600&h=600&fit=crop',
  'rabas-rebozadas': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=600&fit=crop',
  'bastones-de-merluza': 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=600&h=600&fit=crop',
  'empanadas-de-atun-x12': 'https://images.unsplash.com/photo-1601000938259-9e92002320b2?w=600&h=600&fit=crop',
  'nuggets-de-pescado': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=600&h=600&fit=crop',

  // Premium
  'salmon-rosado': 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=600&h=600&fit=crop',
  'trucha-arco-iris': 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=600&h=600&fit=crop',
  'salmon-ahumado': 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&h=600&fit=crop',

  // Conservas
  'atun-en-aceite-x24': 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=600&fit=crop',
  'caballa-en-aceite-x24': 'https://images.unsplash.com/photo-1620820490574-51f8d3f4c7db?w=600&h=600&fit=crop',
  'sardinas-x24': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop',
}

async function main() {
  console.log('🖼️  Updating product images...\n')

  const products = await prisma.product.findMany()

  let updated = 0
  for (const product of products) {
    const imageUrl = productImages[product.slug]
    if (imageUrl) {
      await prisma.product.update({
        where: { id: product.id },
        data: { imageUrl },
      })
      console.log(`  ✅ ${product.name} → image set`)
      updated++
    } else {
      console.log(`  ⚠️  ${product.name} (slug: ${product.slug}) → no image mapping`)
    }
  }

  console.log(`\n🎉 Updated ${updated}/${products.length} products with images`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
