import React from "react";
import { IpcRenderer } from "electron";

export const Donate: React.FC<{ ipcRenderer: () => IpcRenderer }> = ({ ipcRenderer }) => {
    const fakeDonate = () => {
        let fakeDonateData = {
            donateImageUrl: "https://tr.rbxcdn.com/916ea72acafc1a091cf4239279e29a29/150/150/AvatarHeadshot/Png",
            userName: "mihalx",
            robuxAmmount: 500,
            message: "jesteś sus",
        };
        console.log("lul");
        ipcRenderer().send("donate::donate", fakeDonateData);
    };

    return (
        <main>
            <h1>Roblox Donations</h1>
            <form action="">
                <section>
                    <input type="text" placeholder="nickname color" />
                    <input type="text" placeholder="Donate Amount Color" />
                    <input type="text" placeholder="Image URL" />
                    <input type="text" placeholder="message color" />
                </section>
            </form>
            <button onClick={() => fakeDonate()}>Send Fake Donation</button>
        </main>
    );
};
