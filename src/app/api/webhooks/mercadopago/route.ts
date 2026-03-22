import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// MercadoPago IPN Webhook
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Verify it's a payment notification
    if (body.type !== 'payment') {
      return NextResponse.json({ received: true })
    }

    const paymentId = body.data?.id

    if (!paymentId) {
      return NextResponse.json({ error: 'Missing payment ID' }, { status: 400 })
    }

    // Fetch payment details from MercadoPago
    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    )

    if (!mpResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch payment' },
        { status: 500 }
      )
    }

    const mpPayment = await mpResponse.json()

    // Find our payment by MercadoPago preference ID
    const payment = await prisma.payment.findFirst({
      where: { mpPreferenceId: mpPayment.preference_id },
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    // Update payment status
    let status: 'PAID' | 'FAILED' | 'PENDING' = 'PENDING'
    if (mpPayment.status === 'approved') {
      status = 'PAID'
    } else if (['rejected', 'cancelled'].includes(mpPayment.status)) {
      status = 'FAILED'
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        mpPaymentId: String(paymentId),
        mpStatus: mpPayment.status,
        status,
        paidAt: status === 'PAID' ? new Date() : null,
      },
    })

    // Update order payment status
    await prisma.order.update({
      where: { id: payment.orderId },
      data: {
        paymentStatus: status,
      },
    })

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
