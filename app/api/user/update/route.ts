import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySession } from "../../session-verify";
import { UserWithoutPassword } from "@/store/features/user/userSlice";
import { removePassword } from "@/lib/utils";
type jsonData = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
};

export const POST = async (req: NextRequest) => {
    try {
        const { email, firstName, lastName, username } =
            (await req.json()) as jsonData;
        if (!email)
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        if (!firstName)
            return NextResponse.json(
                { message: "First name is required" },
                { status: 400 }
            );
        if (!lastName)
            return NextResponse.json(
                { message: "Last name is required" },
                { status: 400 }
            );
        if (!username)
            return NextResponse.json(
                { message: "Username is required" },
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

        const updatedUser = await db.user.update({
            where: { id: userId },
            data: { firstName, lastName, email, username },
        });
        if (!updatedUser) {
            return NextResponse.json(
                { message: "There was an error while changing the password" },
                { status: 500 }
            );
        }
        const userWithoutPassword = removePassword(updatedUser)[0];

        return NextResponse.json(
            {
                message: "User info updated",
                user: userWithoutPassword as UserWithoutPassword,
            },
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
