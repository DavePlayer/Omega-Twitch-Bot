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
        return () => {
            ipcRenderer.removeAllListeners("timer:console");
        };
    }, []);
    useEffect(() => {
        //clearing console after some amount of characters
        AreaRef.current.scrollTop = AreaRef.current.scrollHeight;
        if (Console.content.length > 800) Console.setContent((prev) => prev.slice(700, prev.length));
    }, [Console.content]);
    return (
        <section className="consoleWrapper">
            <textarea ref={AreaRef} value={Console.content} id="console" readOnly={true}></textarea>
        </section>
    );
};
