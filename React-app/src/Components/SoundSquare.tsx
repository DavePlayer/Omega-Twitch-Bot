import React from "react";
import { sound } from "./Shortcuts";

export const SoundSquare: React.FC<{ sound: sound }> = ({ sound }) => {
    const noImage =
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.webcraft.com.mt%2Fassets%2Fimg%2FNo-Image-Thumbnail.png&f=1&nofb=1";
    return (
        <article className="sound">
            <figure>
                <img src={sound.thumbnailPath || noImage} />
            </figure>
            <h4>{sound.name}</h4>
            <p>{sound.keyBinding}</p>
        </article>
    );
};
