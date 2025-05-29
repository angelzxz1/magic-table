"use client";

import { Button } from "@/components/ui/button";
import { GameTable } from "@/lib/generated/prisma";
import { useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

const CreateTableButton = () => {
    const handleCreateTable = async () => {
        try {
            const response = await fetch("/api/tables", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: "New Game Table",
                    creatorId: "user123",
                }),
            });
            if (!response.ok) {
                throw new Error("Error creating table");
            }
            const data = await response.json();
            console.log("Table created:", data);
        } catch (error) {
            console.error("Failed to create table:", error);
        }
    };

    return (
        <Button
            onClick={handleCreateTable}
            className="cursor-pointer"
            variant="outline"
        >
            Create New Table
            <Plus />
        </Button>
    );
};

const MainPage = () => {
    const [gameTables, setGameTables] = useState<GameTable[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await fetch("/api/tables");
                if (!response.ok) {
                    throw new Error("Error fetching tables");
                }
                const data = await response.json();
                setGameTables(data);
            } catch (error) {
                console.error("Failed to fetch tables:", error);
            }
        };

        fetchTables();
    }, []);
    return (
        <div className="w-full h-full flex ">
            <div className="w-full flex-1 pt-8 gap-8 flex flex-col">
                <div className="w-full flex gap-4 items-center px-4">
                    <CreateTableButton />
                    <Button
                        disabled={loading}
                        className="cursor-pointer"
                        variant="outline"
                        onClick={() => {
                            setLoading(true);
                            fetch("/api/tables")
                                .then((res) => res.json())
                                .then((data) => {
                                    setGameTables(data);
                                    setLoading(false);
                                })
                                .catch((error) => {
                                    console.error(
                                        "Failed to refresh tables:",
                                        error
                                    );
                                    setLoading(false);
                                });
                        }}
                    >
                        Refresh
                        <RefreshCw className={loading ? "animate-spin" : ""} />
                    </Button>
                </div>
                <div className="flex gap-4 bg-neutral-800 p-4 rounded-md flex-wrap min-h-4/5">
                    {gameTables.map((gameTable) => {
                        return (
                            <div key={gameTable.id} className="border p-4 mb-4">
                                <h2 className="text-xl font-bold">
                                    {gameTable.name}
                                </h2>
                                <p>Players: {gameTable.players.join(", ")}</p>
                                <p>Status: {gameTable.status}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MainPage;
