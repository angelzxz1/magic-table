"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
// import { DeckForm } from "./import-deck-form";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CreateTableForm } from "./create-table-form";
import { toast } from "sonner";
export function CreateTableModal({ getTables }: { getTables: () => void }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer">
                    New Table <Plus />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Table</DialogTitle>
                </DialogHeader>
                <div className="flex items-center space-x-2 w-full">
                    <CreateTableForm getTables={getTables} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
