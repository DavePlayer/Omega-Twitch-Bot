import React, { createContext, useState } from "react";
import { Header } from "./Components/Header";
import { Inputs } from "./Components/Inputs";
import { TimerConfig } from "./Components/TimerConfig";
import { Console } from "./Components/Console";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Navigation } from "./Components/Navigation";
import "./index.scss";
import { Shortcuts } from "./Components/Shortcuts";

export const consoleContext = createContext(null);
export interface consoleContext {
    content: string;
    setContent: (arg0: string) => void;
    log: (value: string) => void;
    listens?: boolean;
    setListens: (value: boolean) => void;
}

export const App: React.FC = () => {
    const [content, setContent] = useState<string>("Debugging program:");
    const [listens, setListens] = useState<boolean>(false);
    const log = (value: string) =>
        setContent((prev) => prev + `\n:-- ${value}`);
    return (
        <Router>
            <consoleContext.Provider
                value={{ content, setContent, log, listens, setListens }}
            >
                <Header />
                <Navigation />
                <Redirect to="/" />
                <Route
                    path="/"
                    exact
                    render={() => (
                        <main className="timer">
                            <Inputs />
                            <TimerConfig />
                        </main>
                    )}
                />
                <Route path="/shortcuts" exact render={() => <Shortcuts />} />
                <Console />
            </consoleContext.Provider>
        </Router>
    );
};
