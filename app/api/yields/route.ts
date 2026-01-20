// API route for fetching yield data
import { NextResponse } from 'next/server';
import { fetchYieldData } from '@/lib/yields/yield-fetcher';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const yields = await fetchYieldData();

    return NextResponse.json({
      success: true,
      data: yields,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error in yields API:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch yield data',
      },
      { status: 500 }
    );
  }
}
