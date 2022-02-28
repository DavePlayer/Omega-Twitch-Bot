import React, { createContext, useState, useEffect } from "react";
import { Header } from "./Components/Header";
import { Inputs } from "./Components/Inputs";
import { TimerConfig } from "./Components/TimerConfig";
import { Console } from "./Components/Console";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Navigation } from "./Components/Navigation";
import "./index.scss";
import { Shortcuts } from "./Components/Shortcuts";
import { Donate } from "./Components/Donate/Donate";
import { ipcRenderer, shell } from "electron";
import { AudioPlayer } from "./audioPlayer/AudioPlayer";

export const consoleContext = createContext(null);
export interface consoleContext {
    content: string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
    log: (value: string) => void;
    listens?: boolean;
    setListens: (value: boolean) => void;
}

export const App: React.FC = () => {
    const [content, setContent] = useState<string>("Debugging program:");
    const [listens, setListens] = useState<boolean>(false);
    const [link, setLink] = useState<string>("");
    const IPC = ipcRenderer;
    const [shouldDisplayPlayer, setShouldDisplayPlayer] = useState<boolean>(true);
    useEffect(() => {
        console.log("use Effect working. ipcrender not working", IPC);
        IPC.on("sound::playSound", (e, link) => {
            console.log("trying to play: ", link);
            setShouldDisplayPlayer(false);
            setLink(link);
            setShouldDisplayPlayer(true);
        });
        return () => {
            IPC.removeAllListeners("sound::playSound");
        };
    }, []);
    const log = (value: string) => setContent((prev) => prev + `\n\n:-- ${value}`);
    return (
        <Router>
            <consoleContext.Provider value={{ content, setContent, log, listens, setListens }}>
                <Header />
                <Navigation />
                <Redirect to="/" />
                <Route
                    path="/"
                    exact
                    render={() => (
                        <main className="timer">
                            <Inputs />
                            <TimerConfig ipcRenderer={() => ipcRenderer} shell={shell} />
                        </main>
                    )}
                />
                <Route path="/shortcuts" exact render={() => <Shortcuts />} />
                <Route path="/donate" exact render={() => <Donate ipcRenderer={() => ipcRenderer} />} />
                <Console />
                <AudioPlayer shouldDisplay={shouldDisplayPlayer} link={link} />
            </consoleContext.Provider>
        </Router>
    );
};
