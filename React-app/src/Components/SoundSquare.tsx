import React, { useEffect, useState } from "react";
import { sound } from "./Shortcuts";

export const SoundSquare: React.FC<{ sound: sound }> = ({ sound }) => {
    const [image, setImage] = useState<any>(
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.webcraft.com.mt%2Fassets%2Fimg%2FNo-Image-Thumbnail.png&f=1&nofb=1"
    );
    return (
        <article className="sound">
            <figure>
                <img
                    src={`http://127.0.0.1:3200/getImage/?path=${sound.thumbnailPath}`}
                />
            </figure>
            <h4>{sound.name}</h4>
            <p>{sound.keyBinding}</p>
        </article>
    );
};
