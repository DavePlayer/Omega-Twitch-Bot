import React, { useState, useEffect } from "react";
import { SoundSquare } from "./SoundSquare";
import { AddSoundWrapper } from "./AddSoundWrapper";

export interface sound {
    name: string;
    keyBinding: string;
    soundPath: string;
    thumbnailPath: string;
    volume: number;
    duration?: number;
}

export const Shortcuts: React.FC = () => {
    const [sounds, setSounds] = useState<Array<sound>>([]);
    const fetchData = async () => {
        try {
            const data = await fetch("http://127.0.0.1:3200/sounds");
            const json = await data.json();
            setSounds(json);
        } catch (err) {
            console.log(err);
        }
    };
    const [showWrapper, setShowWrapper] = useState<boolean>(false);
    useEffect(() => {
        fetchData();
    }, [showWrapper]);

    const handleAddSound = () => {
        console.log(`adding sound`);
        setShowWrapper(true);
    };
    return (
        <main className="short">
            <h1>Soundboard</h1>
            <button onClick={() => handleAddSound()}>Add sound</button>
            <section className="sound-board">
                {sounds.length > 0 &&
                    sounds.map((sound, i) => (
                        <SoundSquare key={i} sound={sound} />
                    ))}
            </section>
            {showWrapper && (
                <AddSoundWrapper
                    fetchData={() => fetchData}
                    setShowWrapper={setShowWrapper}
                />
            )}
        </main>
    );
};
