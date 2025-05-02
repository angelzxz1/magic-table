import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyJwt } from "@/api-libs/services/user.service";
import { JwtPayload } from "jsonwebtoken";
import { db } from "@/lib/db";

interface LayoutProps {
    children: React.ReactNode;
}

async function getCookie(name: string) {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(name);
    if (!cookie) return null;
    return cookie.value;
}

const checkSession = async () => {
    const token = await getCookie("token");
    if (!token) {
        console.log("No token found, all good");
        return true;
    }
    const jwt = verifyJwt(token);
    if (!jwt) {
        console.log("Token is invalid, all good");
        return true;
    }
    const { userId, sessionId } = jwt as JwtPayload;
    if (!userId || !sessionId) {
        console.log("Token is invalid, all good");
        return true;
    }
    const session = await db.session.findFirst({
        where: {
            id: sessionId,
            userId: userId,
        },
    });
    if (!session) {
        console.log("Session not found, all good");
        return true;
    }
    return false;
};

const Layout = async ({ children }: LayoutProps) => {
    const isSessionValid = await checkSession();
    if (!isSessionValid) {
        redirect("/home");
    }
    return (
        <div className="flex justify-center items-center h-full w-full ">
            {children}
        </div>
    );
};

export default Layout;
