import React, { useContext, useEffect } from "react";
import { consoleContext } from "../App";
import { ipcRenderer } from "electron";

export const Console: React.FC = () => {
    const Console: consoleContext = useContext(consoleContext);
    useEffect(() => {
        ipcRenderer.on("timer:console", (e, message) => {
            Console.log(message as string);
        });
    }, []);
    return (
        <textarea
            value={Console.content}
            id="console"
            readOnly={true}
        ></textarea>
    );
};
