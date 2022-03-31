import React, { useState, useEffect } from "react";
import { IpcRenderer } from "electron";
import { Form, Field, FieldRenderProps } from "react-final-form";
import { Input } from "../TimerConfig";

export const Donate: React.FC<{ ipcRenderer: IpcRenderer }> = ({ ipcRenderer }) => {
    const [count, setCount] = useState<number>(1);
    const [displayConfig, setDisplayConfig] = useState<boolean>(false);
    const [loginData, setLoginData] = useState<{ login: string; password: string }>();
    const [fonts, setFonts] = useState<Array<string>>(["Adobe Devanagari"]);
    const [selectedFont, setSelectedFont] = useState("Adobe Devanagari");
    const normalInput: React.ComponentType<FieldRenderProps<any>> = (props) => {
        return (
            <>
                <section>
                    <p className="error">{props.meta.touched && props.meta.error}</p>
                    <input
                        {...props.input}
                        {...props.inputProps}
                        type={props.input.type}
                        className={props.className}
                        id={props.input.id}
                        placeholder={props.placeholder}
                    />
                </section>
            </>
        );
    };
    const numberInput: React.ComponentType<FieldRenderProps<any>> = (props) => {
        return (
            <>
                <input
                    {...props.input}
                    {...props.inputProps}
                    type={props.input.type}
                    className={props.className}
                    id={props.input.id}
                    placeholder={props.placeholder}
                />
            </>
        );
    };
    const selectInput: React.ComponentType<FieldRenderProps<any>> = (props) => {
        return (
            <>
                <select
                    style={{ fontFamily: selectedFont }}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    value={selectedFont}
                >
                    {props.elements.map((font: string) => {
                        const fontSplitPath = font.split("/");
                        const fontName = fontSplitPath[fontSplitPath.length - 1].split(".").shift().replace("-", " ");
                        return (
                            <option key={font} style={{ fontFamily: fontName }} value={fontName}>
                                {fontName}
                            </option>
                        );
                    })}
                </select>
            </>
        );
    };
    const fakeDonate = () => {
        setCount((prev) => prev + 1);
        let fakeDonateData = {
            donateImageUrl: "https://tr.rbxcdn.com/916ea72acafc1a091cf4239279e29a29/150/150/AvatarHeadshot/Png",
            userName: "mihalx",
            robuxAmmount: 500,
            message: `twoja mama ${count}`,
            lang: `pl`,
        };
        console.log("lul");
        ipcRenderer.send("donate::donate", fakeDonateData);
    };
    useEffect(() => {
        // get login and password from electron
        // getSystemFonts()
        //     .then((fonts) => setFonts(fonts))
        //     .catch((err) => console.log(err));
        ipcRenderer.send("fonts:getFonts");
        ipcRenderer.on("fonts:sendFonts", (e, fonts) => {
            setFonts(fonts);
        });
        return () => {
            ipcRenderer.removeAllListeners("fonts:sendFonts");
        };
    }, []);

    const handleAuth = (e: Record<string, any>) => {
        console.log("auth: \n", e);
        setDisplayConfig(false);
    };
    const handleColors = (e: Record<string, any>) => {
        console.log("Colors: \n", e);
        ipcRenderer.send("donate::appendSettings", e, "robloxColors");
    };
    const handleFonts = (e: Record<string, any>) => {
        console.log("Fonts: \n", e, selectedFont);
        ipcRenderer.send("donate::appendSettings", { fontSize: e.fontSize, fontFamily: selectedFont }, "robloxFont");
    };
    const validateInput = (value: string) => {
        if (!value || value.length == 0) {
            return "give some input backa";
        }
        return undefined;
    };
    const validateInputColor = (value: string) => {
        if (!value || value.length == 0) {
            return "give some input backa";
        }
        const pattern = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (pattern.test(value) == false) {
            return "invalid input";
        }
        return undefined;
    };

    return (
        <main>
            <h1>Roblox Donations</h1>
            <Form
                name="RobloxData"
                render={({ handleSubmit }) => (
                    <form onSubmit={(e) => handleSubmit(e)} action="#" method="get" id="configForm">
                        {displayConfig ? (
                            <>
                                <section className="configSection">
                                    <Field
                                        type="text"
                                        defaultValue=""
                                        placeholder="username"
                                        id="username"
                                        name="username"
                                        component={Input}
                                        validate={validateInput}
                                    />
                                    <Field
                                        type="text"
                                        defaultValue=""
                                        placeholder="password"
                                        id="password"
                                        name="password"
                                        component={Input}
                                        validate={validateInput}
                                    />
                                </section>
                                <button>append config</button>
                            </>
                        ) : (
                            <button onClick={() => setDisplayConfig(!displayConfig)} type="button" id="showConfig">
                                Show Config
                            </button>
                        )}
                    </form>
                )}
                onSubmit={(e) => handleAuth(e)}
            />
            <Form
                name="colorData"
                render={({ handleSubmit }) => (
                    <form onSubmit={(e) => handleSubmit(e)} action="#" method="get" className="settings-form">
                        <>
                            <h2>Colors settings</h2>
                            <section className="settings-wrapper">
                                <Field
                                    type="text"
                                    defaultValue=""
                                    placeholder="nickname color"
                                    id="nickname-color"
                                    name="nicknameColor"
                                    component={normalInput}
                                    validate={validateInputColor}
                                />
                                <Field
                                    type="text"
                                    defaultValue=""
                                    placeholder="donate ammount color"
                                    id="donate-amount-color"
                                    name="donateAmountColor"
                                    component={normalInput}
                                    validate={validateInputColor}
                                />
                                <Field
                                    type="text"
                                    defaultValue=""
                                    placeholder="message color"
                                    id="message-color-input"
                                    name="messageColor"
                                    component={normalInput}
                                    validate={validateInputColor}
                                />
                                <Field
                                    type="text"
                                    defaultValue=""
                                    placeholder="text-color"
                                    id="text-color-input"
                                    name="textColor"
                                    component={normalInput}
                                    validate={validateInputColor}
                                />
                            </section>
                            <button>Append colors</button>
                        </>
                    </form>
                )}
                onSubmit={(e) => handleColors(e)}
            />
            <Form
                name="fonts-settings"
                render={({ handleSubmit }) => (
                    <form onSubmit={(e) => handleSubmit(e)} action="#" method="get" className="settings-form">
                        <>
                            <h2>Fonts settings</h2>
                            <section className="settings-wrapper">
                                <section>
                                    <Field
                                        type="select"
                                        defaultValue=""
                                        id="text-font-select"
                                        name="fontSelected"
                                        component={selectInput}
                                        elements={fonts}
                                    />
                                    <Field
                                        type="number"
                                        defaultValue="1"
                                        id="font-size"
                                        name="fontSize"
                                        component={numberInput}
                                    />
                                </section>
                            </section>
                            <button>Append font</button>
                        </>
                    </form>
                )}
                onSubmit={(e) => handleFonts(e)}
            />
            <button onClick={() => fakeDonate()}>Send Fake Donation</button>
        </main>
    );
};
