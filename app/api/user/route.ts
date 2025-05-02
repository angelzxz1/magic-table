import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
interface jsonData {
    userId: string;
}

export async function GET(req: NextRequest) {
    return NextResponse.json({
        message: "Hi!",
    });
}
