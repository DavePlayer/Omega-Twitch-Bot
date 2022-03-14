import React, { useState, useEffect } from "react";
import { IpcRenderer } from "electron";
import { Form, Field, FieldRenderProps } from "react-final-form";
import { Input } from "../TimerConfig";

interface IFont {
    path: string;
    postscriptName: string;
    family: string;
    style: string;
    weight: number;
    width: number;
    italic: boolean;
    monospace: boolean;
}

export const Donate: React.FC<{ ipcRenderer: () => IpcRenderer }> = ({ ipcRenderer }) => {
    const [count, setCount] = useState<number>(1);
    const [displayConfig, setDisplayConfig] = useState<boolean>(false);
    const [loginData, setLoginData] = useState<{ login: string; password: string }>();
    const [fonts, setFonts] = useState<Array<IFont>>([
        {
            path: "/Library/Fonts/Arial.ttf",
            postscriptName: "ArialMT",
            family: "Arial",
            style: "Regular",
            weight: 400,
            width: 5,
            italic: false,
            monospace: false,
        },
    ]);
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
    const selectInput: React.ComponentType<FieldRenderProps<any>> = (props) => {
        return (
            <>
                <section>
                    <select name="" id="">
                        {props.elements.map((element: IFont) => {
                            return (
                                <option
                                    key={element.path}
                                    style={{ fontFamily: element.path }}
                                    value={element.postscriptName}
                                >
                                    {element.postscriptName}
                                </option>
                            );
                        })}
                    </select>
                </section>
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
        ipcRenderer().send("donate::donate", fakeDonateData);
    };
    useEffect(() => {
        // get login and password from electron
    }, []);

    const handleSubmit = (e: any) => {
        console.log(e);
        setDisplayConfig(false);
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
                onSubmit={(e) => handleSubmit(e)}
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
                            <button>Apply settings</button>
                        </>
                    </form>
                )}
                onSubmit={(e) => handleSubmit(e)}
            />
            <Form
                name="fonts-settings"
                render={({ handleSubmit }) => (
                    <form onSubmit={(e) => handleSubmit(e)} action="#" method="get" className="settings-form">
                        <>
                            <h2>Fonts settings</h2>
                            <section className="settings-wrapper">
                                <Field
                                    type="select"
                                    defaultValue=""
                                    placeholder="text-color"
                                    id="text-color-input"
                                    name="textColor"
                                    component={selectInput}
                                    validate={validateInputColor}
                                    elements={fonts}
                                />
                            </section>
                            <button>Apply settings</button>
                        </>
                    </form>
                )}
                onSubmit={(e) => handleSubmit(e)}
            />
            <form action="">
                <h2>color settings</h2>
                <section>
                    <input type="text" placeholder="nickname color" />
                    <input type="text" placeholder="Donate Amount Color" />
                </section>
                <button>Apply settings</button>
            </form>
            <form action="">
                <h2>color settings</h2>
                <section>
                    <input type="text" placeholder="nickname color" />
                    <input type="text" placeholder="Donate Amount Color" />
                </section>
                <button>Apply settings</button>
            </form>
            <form action="">
                <h2>Fake data settings</h2>
                <section>
                    <input type="text" placeholder="Image URL" />
                    <input type="text" placeholder="message color" />
                </section>
                <button>Apply settings</button>
            </form>
            <button onClick={() => fakeDonate()}>Send Fake Donation</button>
        </main>
    );
};
