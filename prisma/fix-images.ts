import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

// Fix broken image URLs (404s)
const fixes: Record<string, string> = {
  'filet-de-merluza': 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=600&h=600&fit=crop',
  'atun-en-aceite-x24': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop',
  'caballa-en-aceite-x24': 'https://images.unsplash.com/photo-1551326844-4df70f78d0e9?w=600&h=600&fit=crop',
}

async function main() {
  console.log('🔧 Fixing broken image URLs...\n')

  for (const [slug, imageUrl] of Object.entries(fixes)) {
    const product = await prisma.product.findUnique({ where: { slug } })
    if (product) {
      await prisma.product.update({
        where: { id: product.id },
        data: { imageUrl },
      })
      console.log(`  ✅ ${product.name} → fixed`)
    } else {
      console.log(`  ⚠️  slug "${slug}" not found`)
    }
  }

  console.log('\n🎉 Done!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
