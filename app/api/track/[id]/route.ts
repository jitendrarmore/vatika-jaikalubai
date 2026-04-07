import { NextResponse } from 'next/server';
import { sampleTrees } from '@/lib/mockData';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Try mock data first (production would query Firestore)
  const mockTree = sampleTrees.find((t) => t.trackingId === id);

  if (mockTree) {
    return NextResponse.json({ found: true, tree: mockTree });
  }

  return NextResponse.json({ found: false, message: 'Tree not found' }, { status: 404 });
}
