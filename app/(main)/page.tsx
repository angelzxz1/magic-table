"use client";

import { Button } from "@/components/ui/button";
import { GameTable, User } from "@/lib/generated/prisma";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateTableModal } from "@/components/ui/create-table/create-table-modal";

const StatusText = ({ status }: { status: string }) => {
    return (
        <span
            className={cn(
                "text-sm",
                status === "open"
                    ? "text-green-500"
                    : status === "in_progress"
                    ? "text-yellow-500"
                    : "text-red-500"
            )}
        >
            {status === "open"
                ? "Available"
                : status === "in_progress"
                ? "In Progress"
                : "Closed"}
        </span>
    );
};
interface TableCompType extends GameTable {
    players: User[];
}
const TableComponent = ({ table }: { table: TableCompType }) => {
    const { name, players, status, creator } = table;
    return (
        <div className="border p-4 mb-4 rounded-md bg-neutral-700 text-white w-72 h-72">
            <h2 className="text-xl font-bold">{name}</h2>
            <h2>Host: {creator}</h2>
            {players.map((player) => {
                return (
                    <div key={player.id} className="flex items-center gap-2">
                        <span>{player.username}</span>
                    </div>
                );
            })}
            <p>
                Status: <StatusText status={status} />
            </p>
        </div>
    );
};

const TableList = ({ tables }: { tables: TableCompType[] }) => {
    return (
        <div className="flex gap-4 bg-neutral-800 p-4 rounded-md flex-wrap min-h-4/5 ">
            {tables.map((table) => (
                <TableComponent key={table.id} table={table} />
            ))}
        </div>
    );
};

const MainPage = () => {
    const [gameTables, setGameTables] = useState<TableCompType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const getTables = () => {
        setLoading(true);
        fetch("/api/tables")
            .then((res) => res.json())
            .then((data) => {
                setGameTables(data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };
    useEffect(() => {
        getTables();
    }, []);
    return (
        <div className="w-full h-full flex ">
            <div className="w-full flex-1 pt-8 gap-8 flex flex-col">
                <div className="w-full flex gap-4 items-center px-4">
                    {/* <CreateTableButton getTables={getTables} /> */}
                    <CreateTableModal getTables={getTables} />
                    <Button
                        disabled={loading}
                        className="cursor-pointer"
                        variant="outline"
                        onClick={getTables}
                    >
                        Refresh
                        <RefreshCw className={loading ? "animate-spin" : ""} />
                    </Button>
                </div>
                <TableList tables={gameTables} />
            </div>
        </div>
    );
};

export default MainPage;
