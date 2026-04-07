import { NextResponse } from 'next/server';
import { generateTrackingId } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      uid, userEmail, userName, plantId, plantName,
      occasion, treeName, dedication, plantationDate, cost,
    } = body;

    // Validate required fields
    if (!plantId || !occasion || !treeName || !plantationDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const trackingId = generateTrackingId();

    // In production with Firebase Admin configured, save to Firestore here
    // const { db } = await import('@/lib/firebase/admin');
    // await db.collection('donations').add({ ... });

    return NextResponse.json({
      success: true,
      trackingId,
      message: 'Donation recorded successfully',
    });
  } catch (error) {
    console.error('Donation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
