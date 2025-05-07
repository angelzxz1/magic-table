import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySession } from "../../session-verify";
import { hashPassword, verifyPassword } from "@/api-libs/services/user.service";
type jsonData = {
    currentPassword: string;
    newPassword: string;
};

export const POST = async (req: NextRequest) => {
    try {
        const { currentPassword, newPassword } = (await req.json()) as jsonData;
        if (!currentPassword)
            return NextResponse.json(
                { message: "Current password is required" },
                { status: 400 }
            );
        if (!newPassword)
            return NextResponse.json(
                { message: "New password is required" },
                { status: 400 }
            );
        const session = await verifySession();
        if (!session) {
            const res = NextResponse.json(
                { message: "Session not found" },
                { status: 401 }
            );
            res.cookies.set("token", "", { maxAge: 0 });
            return res;
        }
        const { userId } = session;
        const userbyId = await db.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!userbyId)
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );

        const isMatch = await verifyPassword(
            currentPassword,
            userbyId.password
        );
        if (!isMatch)
            return NextResponse.json(
                { message: "Current password doesn't match" },
                { status: 401 }
            );

        const hashedPassword = await hashPassword(newPassword);

        const updatedUser = await db.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        if (!updatedUser) {
            return NextResponse.json(
                { message: "There was an error while changing the password" },
                { status: 500 }
            );
        }
        const { password, ...userWithoutPassword } = updatedUser;

        return NextResponse.json(
            { message: "Password changed", user: userWithoutPassword },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error changing password:", error);
        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Internal server error",
            },
            { status: 500 }
        );
    }
};
