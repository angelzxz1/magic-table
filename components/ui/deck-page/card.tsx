"use client";
import { RefreshCw } from "lucide-react";
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
    return (
        <div className="w-full h-20 flex justify-center relative ">
            <div className="h-full w-full flex justify-center items-center overflow-visible z-50 hover:z-[52] peer group">
                <div className="absolute left-0 flex-wrap w-8 h-8 group-hover:-translate-x-14 transition-all ">
                    <div className="flex w-full justify-center rounded-r-full border-l border-l-neutral-700 h-full items-center bg-neutral-800">
                        {amount < 10 ? `0${amount}` : amount}
                    </div>
                </div>
                {secondURL && (
                    <Button
                        variant="empty"
                        size="icon"
                        className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 bg-background/90 hover:scale-150 active:scale-125 transition-transform"
                        onClick={() => setIsFront(!isFront)}
                    >
                        <RefreshCw />
                    </Button>
                )}
            </div>
            {!secondURL ? (
                <Image
                    src={url}
                    alt={name}
                    width={170}
                    height={100}
                    className="border-neutral-700 border w-full transition-transform peer-hover:scale-150 peer-hover:translate-y-7 rounded-xl absolute top-0 z-30 peer-hover:z-[51]"
                />
            ) : isFront ? (
                <Image
                    src={url}
                    alt={name}
                    width={170}
                    height={100}
                    className="border-neutral-700 border w-full transition-transform peer-hover:scale-150 peer-hover:translate-y-7 rounded-xl absolute top-0 z-30 peer-hover:z-[51]"
                />
            ) : (
                <Image
                    src={secondURL}
                    alt={name}
                    width={170}
                    height={100}
                    className="border-neutral-700 border w-full transition-transform peer-hover:scale-150 peer-hover:translate-y-7 rounded-xl absolute top-0 z-30 peer-hover:z-[51]"
                />
            )}
        </div>
    );
};
