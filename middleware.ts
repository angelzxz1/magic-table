// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value as string;

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/api/protected/:path*",
        "/home",
        "/decks/:path",
    ], // rutas protegidas
};
