import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = 'INR', receipt } = body;

    // Validate: minimum 100 paise (₹1)
    if (!amount || typeof amount !== 'number' || amount < 100) {
      return NextResponse.json(
        { error: 'Amount must be at least 100 paise (₹1)' },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount,          // in paise
      currency,
      receipt: receipt || `vatika_${Date.now()}`,
      notes: {
        platform: 'vatika-jaikalubai',
      },
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err: any) {
    console.error('[create-order] Error:', err);
    const status = err?.statusCode === 401 ? 401 : 500;
    return NextResponse.json(
      { error: err?.error?.description || 'Failed to create order' },
      { status }
    );
  }
}
