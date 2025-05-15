"use client";
import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DeckForm } from "./import-deck-form";
import Link from "next/link";

export function AddNewDeck() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Add New Deck</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Deck</DialogTitle>
                    <DialogDescription>
                        This is not to buil a deck, for that we recommend{" "}
                        <Link
                            href="https://archidekt.com/"
                            className="text-sm text-blue-500 hover:underline"
                            target="_blank"
                        >
                            Archidekt
                        </Link>
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 w-full">
                    <DeckForm />
                </div>
            </DialogContent>
        </Dialog>
    );
}
