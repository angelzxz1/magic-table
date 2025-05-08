import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const inputVarinats = cva(
    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
        variants: {
            variant: {
                default:
                    "bg-transparent dark:bg-input/30 border-input shadow-xs transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                ghost: "hover:text-accent-foreground border-none ",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

function Input({
    size,
    className,
    type,
    variant,
    ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVarinats>) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(inputVarinats({ variant, className }))}
            {...props}
        />
    );
}

export { Input };
