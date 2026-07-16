import { NextRequest, NextResponse } from "next/server";

const FORWARDED_PARAMS = ["estado", "fechaDesde", "fechaHasta", "limit", "offset", "sortBy", "sortDir"] as const;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const url = new URL(`${process.env.BUYER_APP_URL}/api/dashboard-analytics/orders`);
  for (const key of FORWARDED_PARAMS) {
    const value = searchParams.get(key);
    if (value) url.searchParams.set(key, value);
  }

  try {
    const res = await fetch(url.toString(), {
      headers: { "x-api-key": process.env.BUYER_API_KEY! },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Buyer no disponible" }, { status: 502 });
    }

    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: "Buyer no disponible" }, { status: 502 });
  }
}