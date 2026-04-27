import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    // Init inside try — if env vars missing, error is caught and returned as JSON
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error('[create-order] Missing Razorpay env vars!', {
        hasKeyId: !!keyId,
        hasKeySecret: !!keySecret,
        razorpayKeysFound: Object.keys(process.env).filter(k => k.toLowerCase().includes('razorpay'))
      });
      return NextResponse.json(
        { error: 'Payment service not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

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
      amount,
      currency,
      receipt: receipt || `vatika_${Date.now()}`,
      notes: { platform: 'vatika-jaikalubai' },
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
      { error: err?.error?.description || err?.message || 'Failed to create order' },
      { status }
    );
  }
}
