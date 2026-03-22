import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const zones = await prisma.deliveryZone.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, name: true, deliveryDays: true },
  })

  return NextResponse.json(zones)
}
