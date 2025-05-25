"use client";
import { Minus, Plus, RefreshCw, X } from "lucide-react";
import { Button } from "../button";
import Image from "next/image";
import { useState } from "react";

export const CardComp = ({
    url,
    secondURL,
    amount,
    name,
}: {
    url: string;
    secondURL: string | null;
    amount: number;
    name: string;
}) => {
    const [isFront, setIsFront] = useState<boolean>(true);
    if (secondURL)
        return (
            <div className="w-full h-20 flex justify-center relative">
                <div className="h-full w-full flex justify-center items-center overflow-visible z-50 hover:z-[52] peer group">
                    <div className="group-hover:translate-y-7 absolute left-0 flex-wrap gap-1 w-12 h-12">
                        <div className="flex justify-center bg-background rounded-full border dark:border-white border-black w-full">
                            {amount < 10 ? `0${amount}` : amount}
                        </div>
                    </div>
                    <Button
                        variant="empty"
                        size="icon"
                        className="group-hover:translate-y-7 absolute bottom-1/2 right-1/2 translate-x-1/2 hidden group-hover:flex translate-y-1/2 bg-background/70 hover:scale-110 active:scale-100 transition-transform"
                        onClick={() => setIsFront(!isFront)}
                    >
                        <RefreshCw />
                    </Button>
                </div>
                {isFront ? (
                    <Image
                        src={url}
                        alt={name}
                        width={170}
                        height={100}
                        className="w-full transition-transform peer-hover:scale-125 peer-hover:translate-y-7 rounded-xl absolute top-0 z-30 peer-hover:z-[51]"
                    />
                ) : (
                    <Image
                        src={secondURL}
                        alt={name}
                        width={170}
                        height={100}
                        className="w-full transition-transform peer-hover:scale-125 peer-hover:translate-y-7 rounded-xl absolute top-0 z-30 peer-hover:z-[51]"
                    />
                )}
            </div>
        );
    return (
        <div className="w-full h-20 flex justify-center relative">
            <div className="h-full w-full flex justify-center items-center overflow-visible z-50 hover:z-[52] peer group">
                <div className="absolute left-0 flex-wrap w-8 h-8 group-hover:translate-y-7 group-hover:-translate-x-5 transition-all">
                    <div className="flex w-full justify-center bg-background rounded-r-full border-r dark:border-white border-black h-full items-center">
                        {amount < 10 ? `0${amount}` : amount}
                    </div>
                </div>
            </div>

            <Image
                src={url}
                alt={name}
                width={170}
                height={100}
                className="w-full transition-transform peer-hover:scale-125 peer-hover:translate-y-7 rounded-xl absolute top-0 z-30 peer-hover:z-[51]"
            />
        </div>
    );
};
