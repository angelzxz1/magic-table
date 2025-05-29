import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Asegúrate de tener tu cliente de Prisma configurado

// GET: listar mesas disponibles
export async function GET() {
    const tables = await db.gameTable.findMany({
        where: { status: "open" },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tables);
}

// POST: crear una nueva mesa
export async function POST(request: Request) {
    const body = await request.json();
    const { name, creatorId } = body;

    const table = await db.gameTable.create({
        data: {
            name,
            players: [creatorId],
        },
    });

    return NextResponse.json(table);
}
