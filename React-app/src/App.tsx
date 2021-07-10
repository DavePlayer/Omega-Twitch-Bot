import React, { createContext, useState } from "react";
import { Header } from "./Components/Header";
import { Inputs } from "./Components/Inputs";
import { TimerConfig } from "./Components/TimerConfig";
import { Console } from "./Components/Console";
import "./index.scss";

export const consoleContext = createContext(null);
export interface consoleContext {
    content: string;
    setContent: (arg0: string) => void;
    log: (value: string) => void;
}

export const App: React.FC = () => {
    const [content, setContent] = useState<string>("Debugging program:");
    const log = (value: string) =>
        setContent((prev) => prev + `\n:-- ${value}`);
    return (
        <>
            <Header />
            <main className="timer">
                <consoleContext.Provider value={{ content, setContent, log }}>
                    <Inputs />
                    <TimerConfig />
                    <Console />
                </consoleContext.Provider>
            </main>
        </>
    );
};
