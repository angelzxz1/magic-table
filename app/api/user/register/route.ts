import { NextRequest, NextResponse } from "next/server";
import {
    createUser,
    findUserByEmail,
    findUserById,
    hashPassword,
} from "@/api-libs/services/user.service";
import { User } from "@/lib/generated/prisma";

type jsonData = {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export const POST = async (req: NextRequest) => {
    try {
        const { email, password, firstName, lastName, username } =
            (await req.json()) as jsonData;
        if (!username)
            return new NextResponse("Username is required", { status: 400 });
        if (!firstName)
            return new NextResponse("FirstName is required", { status: 400 });
        if (!lastName)
            return new NextResponse("LastName is required", { status: 400 });
        if (!email)
            return new NextResponse("Email is required", { status: 400 });
        if (!password)
            return new NextResponse("Password is required", { status: 400 });

        const existingUser = await findUserById(username);

        if (existingUser)
            return new NextResponse("Username already used", { status: 400 });

        const existingEmail = await findUserByEmail(email);

        if (existingEmail)
            return new NextResponse("Email already used", { status: 400 });

        const hashedPassword = await hashPassword(password);
        const newUser: User = await createUser({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            username,
        });

        if (!newUser)
            return new NextResponse("Error creating user", { status: 500 });

        return NextResponse.json(
            {
                message: "User created successfully",
                newUser,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating user:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
