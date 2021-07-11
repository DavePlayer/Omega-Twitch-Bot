import { raw } from "express";
import React, { useEffect, useState } from "react";
import { handleSubmit } from "./Inputs";

export const AddSoundWrapper: React.FC = () => {
    const [keys, setKeys] = useState<Array<string>>([]);
    const [shortcut, setShortcut] = useState<string>("");
    const [files, setFiles] = useState<Array<any>>([]);
    const [name, setName] = useState<string>("");
    useEffect(() => {
        //     const listener: EventListener = (e: Event) => {
        //         console.log(e);
        //         if (isFocused) {
        //             console.log(e);
        //         }
        //     };
        //     document.addEventListener("keydown", listener);
        //     return () =>
        //         document.removeEventListener("keydown", listener as EventListener);
        document
            .querySelector('input[type="search"]')
            .addEventListener("search", () => setShortcut(""));
        return () =>
            document.removeEventListener("search", () => setShortcut(""));
    }, []);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(files);
        console.log(shortcut);
        console.log(name);
        const rawData = new FormData();
        rawData.append("thunbnail", files[0][0]);
        rawData.append("sound", files[1][0]);
        rawData.append("shortcut", shortcut);
        rawData.append("name", name);
        fetch("http://127.0.0.1:3200/sounds", {
            method: "POST",
            body: rawData,
        })
            .then((data) => console.log(data))
            .catch((err) => console.log(err));
    };
    return (
        <div className="wrapper">
            <form action="#" onSubmit={(e) => handleSubmit(e)} className="box">
                <h1>Add sound</h1>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Name"
                />
                <input
                    type="search"
                    className="search"
                    placeholder="shortcut"
                    onKeyDown={(e) => {
                        console.log(e.key);
                        setKeys((prev) => {
                            console.log([...prev, e.key]);
                            return [...prev, e.key];
                        });
                        setShortcut((prev) => {
                            if (prev.length == 0) {
                                return prev + e.key;
                            }
                            return prev + ` + ${e.key}`;
                        });
                    }}
                    onChange={() => null}
                    value={shortcut}
                />
                <input
                    type="file"
                    onChange={(e) => {
                        setFiles((prev) => [...prev, e.target.files]);
                    }}
                />
                <input
                    type="file"
                    className="mp3"
                    onChange={(e) => {
                        setFiles((prev) => [...prev, e.target.files]);
                    }}
                />
                <button>Upload Sound</button>
                <button>Cancel</button>
            </form>
        </div>
    );
};
