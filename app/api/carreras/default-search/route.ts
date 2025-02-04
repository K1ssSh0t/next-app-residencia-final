import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ilike, like } from "drizzle-orm";
import { carreras } from "@/schema/carreras";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 3) {
    return NextResponse.json([]);
  }

  const carrerasdata = await db
    .select()
    .from(carreras)
    .where(query ? like(carreras.id, `${query}`) : undefined)
    .limit(50)
    .orderBy(carreras.descripcion);

  return NextResponse.json(carrerasdata);
}
