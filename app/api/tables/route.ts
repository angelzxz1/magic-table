import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Asegúrate de tener tu cliente de Prisma configurado

// GET: listar mesas disponibles
export async function GET() {
    const tables = await db.gameTable.findMany({
        where: { status: "open" },
        orderBy: { createdAt: "desc" },
        include: {
            players: true,
        },
    });

    return NextResponse.json(tables);
}

// POST: crear una nueva mesa
export async function POST(request: Request) {
    const body = await request.json();
    const { name, creatorId } = body;
    // Verifica que se haya proporcionado un nombre y un creador
    if (!name || !creatorId) {
        return NextResponse.json(
            { error: "Name and creator username are required" },
            { status: 400 }
        );
    }
    // Crea una nueva mesa en la base de datos y la asigna al creador
    const table = await db.gameTable.create({
        data: {
            name,
            players: {
                connect: {
                    id: creatorId, // Asegúrate de que el creador exista en la base de datos
                },
            },
        },
        include: {
            players: true, // Incluye los jugadores en la respuesta
        },
    });

    return NextResponse.json(table);
}

export async function DELETE(request: Request) {
    // Elimina una mesa por ID
    const { id, requestingUsername } = await request.json(); // Asegúrate de enviar el ID en el cuerpo de la solicitud

    if (!id) {
        // Verifica que se haya proporcionado un ID
        return NextResponse.json(
            { error: "Table ID is required" },
            { status: 400 }
        );
    }
    if (!requestingUsername) {
        // Verifica que se haya proporcionado un nombre de usuario
        return NextResponse.json(
            { error: "Requesting username is required" },
            { status: 400 }
        );
    }
    // Verifica si el usuario que solicita la eliminación es el unico en la mesa
    const table = await db.gameTable.findUnique({
        where: { id },
        select: { players: true },
    });
    if (!table) {
        return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }
    if (table.players.length > 1) {
        return NextResponse.json(
            { error: "Cannot be deleted, more than one player left" },
            { status: 403 }
        );
    }
    if (table.players[0] !== requestingUsername) {
        return NextResponse.json(
            { error: "You are not authorized to delete this table" },
            { status: 403 }
        );
    }
    // Elimina la mesa
    const deletedTable = await db.gameTable.delete({
        where: { id },
    });

    return NextResponse.json(deletedTable);
}
