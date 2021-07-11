import React, { useEffect, useState } from "react";

export const AddSoundWrapper: React.FC = () => {
    const [keys, setKeys] = useState<Array<string>>([]);
    const [shortcut, setShortcut] = useState<string>("");
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
    return (
        <div className="wrapper">
            <form action="#" className="box">
                <h1>Add sound</h1>
                <input type="text" placeholder="Name" />
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
                    value={shortcut}
                />
                <input type="file" />
                <input type="file" className="mp3" />
            </form>
        </div>
    );
};
