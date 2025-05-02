"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User } from "@/lib/generated/prisma";
import { Loader } from "lucide-react";
const formSchema = z
    .object({
        username: z.string().min(2, {
            message: "Email must be at least 5 characters.",
        }),
        firstName: z.string().min(2, {
            message: "First Name must be at least 2 characters.",
        }),
        lastName: z.string().min(2, {
            message: "Last Name must be at least 2 characters.",
        }),
        // birthday: z.date().min(new Date(1900, 0, 1), {
        //     message: "Please enter a valid date.",
        // }),
        email: z.string().min(2, {
            message: "Email must be at least 5 characters.",
        }),
        password: z.string().min(2, {
            message: "Password must be at least 5 characters.",
        }),
        repeatPassword: z.string().min(2, {
            message: "Password must be at least 5 characters.",
        }),
    })
    .refine((data) => data.password === data.repeatPassword, {
        message: "Passwords do not match",
        path: ["password"],
    })
    .refine((data) => data.password === data.repeatPassword, {
        message: "Passwords do not match",
        path: ["repeatPassword"],
    })
    .refine(
        (data) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(data.email);
        },
        {
            message: "Invalid email address",
            path: ["email"],
        }
    )
    .refine(
        (data) => {
            const usernameRegex = /^[a-zA-Z0-9_]+$/;
            return usernameRegex.test(data.username);
        },
        {
            message:
                "Username can only contain letters, numbers, and underscores",
            path: ["username"],
        }
    )
    .refine(
        (data) => {
            const passwordRegex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
            return passwordRegex.test(data.password);
        },
        {
            message:
                "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
            path: ["password"],
        }
    );

export function RegisterForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            firstName: "",
            lastName: "",
            // birthday: new Date(),
            email: "",
            password: "",
            repeatPassword: "",
        },
        mode: "onChange",
    });
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const res = await axios.post<User>("/api/user/register", values);
            if (res.status !== 201) return console.log("There was an error");
            router.push("/login");
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <div className="h-2/3 gap-4 grid ">
                    <div className="flex gap-4 justify-evenly items-start h-1/3">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormControl>
                                        <Input
                                            placeholder="Username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex gap-4 justify-evenly items-start h-1/3">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormControl>
                                        <Input
                                            placeholder="First Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormControl>
                                        <Input
                                            placeholder="Last Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex gap-4 justify-evenly items-start h-1/3">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormControl>
                                        <Input
                                            placeholder="Password"
                                            {...field}
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="repeatPassword"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormControl>
                                        <Input
                                            placeholder="Repeat Password"
                                            {...field}
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="w-full h-1/3 flex flex-wrap items-center justify-between ">
                    <div className="w-full flex justify-end-safe">
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <Loader className="animate-spin" />
                            ) : (
                                "Register"
                            )}
                        </Button>
                    </div>
                    <div className="w-full flex justify-end">
                        <p className="text-sm text-muted-foreground text-center">
                            Already have an account?{"  "}
                            <Link
                                href="/login"
                                className="text-sm text-blue-500 hover:underline"
                            >
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </form>
        </Form>
    );
}
