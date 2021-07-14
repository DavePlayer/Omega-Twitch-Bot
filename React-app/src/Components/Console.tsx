import React, { useContext, useEffect, useRef } from "react";
import { consoleContext } from "../App";
import { ipcRenderer } from "electron";

export const Console: React.FC = () => {
    const Console: consoleContext = useContext(consoleContext);
    const AreaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (Console.listens == false) {
            ipcRenderer.on("timer:console", (e, message) => {
                Console.log(message as string);
            });
            Console.setListens(true);
        }
    }, []);
    useEffect(() => {
        AreaRef.current.scrollTop = AreaRef.current.scrollHeight;
    }, [Console.content]);
    return (
        <section className="consoleWrapper">
            <textarea
                ref={AreaRef}
                value={Console.content}
                id="console"
                readOnly={true}
            ></textarea>
        </section>
    );
};
