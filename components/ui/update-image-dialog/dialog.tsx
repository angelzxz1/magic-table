"use client";

import { SingleImageDropzone } from "@/components/upload/single-image";
import {
    UploaderProvider,
    type UploadFn,
} from "@/components/upload/uploader-provider";
import { useEdgeStore } from "@/lib/edgestore";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/features/user/userSlice";
import axios from "axios";
import * as React from "react";

export function SingleImageDropzoneUsage({ userId }: { userId: string }) {
    const { edgestore } = useEdgeStore();
    const dispatch = useAppDispatch();

    const uploadFn: UploadFn = React.useCallback(
        async ({ file, onProgressChange, signal }) => {
            try {
                const updatePicture = await edgestore.publicImages.upload({
                    file,
                    signal,
                    onProgressChange,
                });
                const res = await axios.post("/api/user/update-picture", {
                    pictureUrl: updatePicture.url,
                    thumbnailUrl: updatePicture.thumbnailUrl,
                    userId,
                });
                if (res.status !== 200) {
                    throw new Error("Failed to update picture");
                }
                dispatch(setUser(res.data.user));
                // console.log(res.data);
                return updatePicture;
            } catch (error) {
                console.error("Error uploading file:", error);
                throw error;
            }
            // Upload the file to EdgeStore
        },
        [edgestore]
    );

    return (
        <UploaderProvider uploadFn={uploadFn} autoUpload>
            <SingleImageDropzone
                height={200}
                width={200}
                dropzoneOptions={{
                    maxSize: 1024 * 1024 * 1, // 1 MB
                }}
            />
        </UploaderProvider>
    );
}
