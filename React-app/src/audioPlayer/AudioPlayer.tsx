import React from "react";
import { IpcRenderer } from "electron";

export const AudioPlayer: React.FC<{ shouldDisplay: boolean; link: string }> = ({ shouldDisplay, link }) => {
    return (
        <>
            {shouldDisplay && (
                <video hidden={true} autoPlay={true} controls={true}>
                    <source src={link} type="audio/mpeg" />
                </video>
            )}
        </>
    );
};
