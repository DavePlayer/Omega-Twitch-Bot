import React, { useState, useEffect } from "react";
import { SoundSquare } from "./SoundSquare";

export interface sound {
    soundPath: string;
    thumbnailPath: string;
    name: string;
    keyBinding: string;
    volume: number;
}

export const Shortcuts: React.FC = () => {
    const [sounds, setSounds] = useState<Array<sound>>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetch("http://127.0.0.1:3200/sounds");
                const json = await data.json();
                setSounds(json);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, []);
    return (
        <main className="short">
            <h1>Soundboard</h1>
            <section className="sound-board">
                {sounds.length > 0 &&
                    sounds.map((sound) => <SoundSquare sound={sound} />)}
            </section>
        </main>
    );
};
