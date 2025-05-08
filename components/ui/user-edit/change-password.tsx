"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader, Save } from "lucide-react";
import { User } from "@/lib/generated/prisma";
import { useAppDispatch } from "@/store/hooks";
import { setUser, UserWithoutPassword } from "@/store/features/user/userSlice";

const formSchema = z
    .object({
        currentPassword: z.string().min(8, {
            message: "Current password must be at least 8 characters.",
        }),
        newPassword: z.string().min(8, {
            message: "New password must be at least 8 characters.",
        }),
        repeatPassword: z.string().min(8, {
            message: "Repeat password must be at least 8 characters.",
        }),
    })
    .refine(
        (data) => {
            const passwordRegex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
            return passwordRegex.test(data.newPassword);
        },
        {
            message:
                "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
            path: ["newPassword"],
        }
    )
    .refine((data) => data.newPassword === data.repeatPassword, {
        message: "Passwords do not match",
        path: ["repeatPassword"],
    });

export function ChangePassword() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            repeatPassword: "",
        },
        mode: "onChange",
    });
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            console.log(values);
            const res = await axios.post<{
                message: string;
                user: UserWithoutPassword;
            }>("/api/user/change-password", values);
            const { data } = res;
            dispatch(setUser(data.user));
            router.refresh();
            toast.success("Password updated successfully");
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    "An unexpected error occurred.";

                form.setError("currentPassword", {
                    type: "manual",
                    message,
                });
            } else {
                form.setError("currentPassword", {
                    type: "manual",
                    message: "Unexpected error.",
                });
            }
        }
        setLoading(false);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="gap-8 flex flex-col h-full p-8 justify-between"
            >
                <div className="w-full flex flex-wrap gap-4 items-center justify-between">
                    <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="flex justify-center">
                                    Current Password
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="flex justify-center">
                                    New Password
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="repeatPassword"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="flex justify-center">
                                    Repeat Password
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="w-full flex justify-end-safe">
                    <Button
                        type="submit"
                        className="cursor-pointer"
                        onSubmit={() => {
                            console.log("Aja que es la monda tuya?");
                        }}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader className="animate-spin" />
                        ) : (
                            <Save />
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
