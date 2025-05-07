import { verifyJwt } from "@/api-libs/services/user.service";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export type sessionAndUser = {
    sessionId: string;
    userId: string;
};
export type verifySessionReturn = sessionAndUser | null;

export const verifySession = async (): Promise<verifySessionReturn> => {
    try {
        const cookieStore = await cookies();

        if (!cookieStore) return null;

        const token = cookieStore.get("token");

        if (!token) return null;

        const { sessionId, userId } = verifyJwt(token.value) as {
            sessionId: string;
            userId: string;
        };

        if (!sessionId || !userId) {
            return null;
        }
        const sessionfound = await db.session.findUnique({
            where: {
                id: sessionId,
            },
        });
        if (!sessionfound) return null;
        return {
            sessionId,
            userId,
        };
    } catch (error) {
        console.log(error);
        return null;
    }
};
