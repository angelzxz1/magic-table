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
import { Loader } from "lucide-react";
import { User } from "@/lib/generated/prisma";
const formSchema = z.object({
    email: z.string().min(2, {
        message: "Email must be at least 5 characters.",
    }),
    password: z.string().min(2, {
        message: "Password must be at least 5 characters.",
    }),
});

export function LoginForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const res = await axios.post("/api/user/login", values);
            if (res.status !== 200) return console.log("There was an error");
            const data = await res.data;
            const { user } = data;
            const { username } = user as User;
            router.push(`/${username}`);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <div className="h-1/3 w-full "></div>
                <div className="h-1/3 gap-4 grid">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
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
                </div>
                <div className="w-full h-1/3 flex flex-wrap items-center justify-between ">
                    <div className="w-full flex justify-end-safe">
                        <Button type="submit">
                            {loading ? (
                                <Loader className="animate-spin" />
                            ) : (
                                "Log in"
                            )}
                        </Button>
                    </div>
                    <div className="w-full flex justify-end">
                        <p className="text-sm text-muted-foreground text-center">
                            Don't have an account?{"  "}
                            <Link
                                href="/register"
                                className="text-sm text-blue-500 hover:underline"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </form>
        </Form>
    );
}
