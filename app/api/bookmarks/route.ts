import { getProductByIds } from '@/lib/actions';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const paramIds = request.nextUrl.searchParams.get('ids');
  const bookmarks = paramIds?.split(',');
  let json = {};
  if (Array.isArray(bookmarks)) {
    try {
      const bookmarkProducts = await getProductByIds(bookmarks);
      json = {
        status: 200,
        bookmarkProducts,
        error: false,
        message: 'Bookmarked Product Fetch Successfully.',
      };
    } catch (error) {
      json = {
        status: 500,
        bookmarkProducts: [],
        error: true,
        message: 'Failed to fetch bookmarked products.',
      };
    }
  } else {
    json = {
      status: 400,
      bookmarkProducts: [],
      error: true,
      message: 'Invalid query parameter',
    };
  }

  return NextResponse.json(json);
}
