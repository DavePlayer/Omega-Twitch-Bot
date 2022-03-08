import { raw } from "express";
import React, { useEffect, useState } from "react";
import { handleSubmit } from "./Inputs";

interface props {
    setShowWrapper: React.Dispatch<React.SetStateAction<boolean>>;
    fetchData: () => void;
}

export const AddSoundWrapper: React.FC<props> = ({ setShowWrapper, fetchData }) => {
    const [keys, setKeys] = useState<Array<string>>([]);
    const [shortcut, setShortcut] = useState<string>("");
    const [files, setFiles] = useState<Array<any>>([]);
    const [name, setName] = useState<string>("");
    const [error, setError] = useState("Keys as [] ; ' , . / \\ may cause bugs of key combinations");
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
        document.querySelector('input[type="search"]').addEventListener("search", () => setShortcut(""));
        return () => document.removeEventListener("search", () => setShortcut(""));
    }, []);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (name.length == 0 || shortcut.length == 0) {
            return setError("Some input is empty");
        }
        if (
            (files[0][0].name.includes("png") ||
                files[0][0].name.includes("jpg") ||
                files[0][0].name.includes("jpeg")) &&
            (files[1][0].name.includes("mp3") || files[1][0].name.includes("wav"))
        ) {
            console.log(files);
            console.log(shortcut);
            console.log(name);
            const rawData = new FormData();
            rawData.append("thumbnail", files[0][0]);
            rawData.append("sound", files[1][0]);
            rawData.append("shortcut", shortcut);
            rawData.append("name", name);
            fetch(`${process.env.ELECTRON_SERVER}/sounds`, {
                method: "POST",
                body: rawData,
            })
                .then((data) => {
                    console.log(data);
                    console.log("CLOSe eeeshjkaf ");
                    setShowWrapper(false);
                    //fetchData();
                })
                .catch((err) => console.log(err));
        } else {
            return setError("You messed up Files");
        }
    };
    return (
        <div className="wrapper">
            <form action="#" onSubmit={(e) => handleSubmit(e)} className="box">
                <h1>Add sound</h1>
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Name" />
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
                        files.length <= 1
                            ? setFiles((prev: any) => [...prev, e.target.files])
                            : setFiles((prev) => prev.map((file, i) => (i == 0 ? e.target.files : file) || e));
                    }}
                />
                <input
                    type="file"
                    className="mp3"
                    onChange={(e) => {
                        files.length <= 1
                            ? setFiles((prev: any) => [...prev, e.target.files])
                            : setFiles((prev) => prev.map((file, i) => (i == 1 ? e.target.files : file) || e));
                    }}
                />
                <p>{error}</p>
                <button type="submit">Upload Sound</button>
                <button onClick={() => setShowWrapper(false)}>Cancel</button>
            </form>
        </div>
    );
};
