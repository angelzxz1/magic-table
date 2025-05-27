import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { removePassword } from "@/lib/utils";
type jsonData = {
    pictureUrl: string;
    thumbnailUrl: string;
    userId: string;
};

export const POST = async (req: NextRequest) => {
    try {
        const { pictureUrl, thumbnailUrl, userId } =
            (await req.json()) as jsonData;
        if (!pictureUrl)
            return new NextResponse("Image URL is required", { status: 400 });
        if (!thumbnailUrl)
            return new NextResponse("Thumbnail URL is required", {
                status: 400,
            });
        if (!userId)
            return new NextResponse("User ID is required", { status: 400 });
        console.log(userId);
        const updatedUser = await db.user.update({
            where: { id: userId },
            data: {
                thumbnailUrl,
                pictureUrl,
            },
        });
        if (!updatedUser) {
            return new NextResponse("User not found", { status: 404 });
        }
        const userWithoutPassword = removePassword(updatedUser)[0];
        return NextResponse.json(
            { message: "User updated", user: userWithoutPassword },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating user picture:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
};
