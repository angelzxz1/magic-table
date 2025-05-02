import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const createUser = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    username: string;
}) => {
    return db.user.create({
        data: {
            ...data,
        },
    });
};

export const findUserByEmail = async (email: string) => {
    return db.user.findUnique({ where: { email } });
};
export const findUserById = async (userId: string) => {
    return db.user.findUnique({ where: { id: userId } });
};
export const hashPassword = async (password: string) => {
    return bcrypt.hash(password, 10);
};
export const verifyPassword = async (password: string, hashed: string) => {
    return bcrypt.compare(password, hashed);
};

export const generateToken = (userId: string, sessionId: string) => {
    return jwt.sign({ userId, sessionId }, JWT_SECRET, { expiresIn: "30d" });
};
export const matchSession = async (sessionId: string, userId: string) => {
    return db.session.findFirst({
        where: {
            id: sessionId,
            userId: userId,
        },
    });
};
export const createSession = async (userId: string) => {
    return db.session.create({
        data: {
            userId,
        },
    });
};

export function verifyJwt(token: string) {
    try {
        if (!token) return null;
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
}
