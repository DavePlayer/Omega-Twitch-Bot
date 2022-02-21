import { ipcRenderer } from "electron/renderer";
import React, { useState, useContext } from "react";
import { Form, Field, FieldRenderProps } from "react-final-form";
import { consoleContext } from "../App";
import { IpcRenderer } from "electron";

const handleSubmit = (
    e: any,
    Console: consoleContext,
    setDisplayConfig: any,
    ipcRenderer: IpcRenderer
) => {
    console.log(e);
    Console.log(`Updating Config: ${JSON.stringify(e)}`);
    ipcRenderer.send("app:updateConfig", e.token, e.username);
    setDisplayConfig(false);
};

const Input: React.ComponentType<FieldRenderProps<any>> = (props) => {
    return (
        <section className="input-and-error">
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
    );
};

const checkLength = (value: string) => {
    if (!value || value.length == 0) {
        return "wypełnij coś debilu";
    }
    return undefined;
};

export const TimerConfig: React.FC<{
    ipcRenderer: () => IpcRenderer;
    shell: any;
}> = ({ ipcRenderer, shell }) => {
    const [displayConfig, setDisplayConfig] = useState<boolean>(false);
    const Console: consoleContext = useContext(consoleContext);
    return (
        <>
            <Form
                name="twitchConfig"
                render={({ handleSubmit }) => (
                    <form
                        onSubmit={(e) => handleSubmit(e)}
                        action="#"
                        method="get"
                        id="configForm"
                    >
                        {displayConfig ? (
                            <>
                                <section className="configSection">
                                    <Field
                                        type="text"
                                        defaultValue=""
                                        placeholder="user token"
                                        id="token"
                                        name="token"
                                        component={Input}
                                        validate={checkLength}
                                    />
                                    <Field
                                        type="text"
                                        defaultValue=""
                                        placeholder="twitch username"
                                        id="username"
                                        name="username"
                                        component={Input}
                                        validate={checkLength}
                                    />
                                </section>
                                <p>
                                    Click{" "}
                                    <a
                                        onClick={() => {
                                            shell.openExternal(
                                                `https://twitchapps.com/tmi/`
                                            );
                                            shell.beep();
                                        }}
                                    >
                                        {" "}
                                        here{" "}
                                    </a>{" "}
                                    to get token
                                </p>
                                <button>append config</button>
                            </>
                        ) : (
                            <button
                                onClick={() => setDisplayConfig(!displayConfig)}
                                type="button"
                                id="showConfig"
                            >
                                Show Config
                            </button>
                        )}
                    </form>
                )}
                onSubmit={(e) =>
                    handleSubmit(e, Console, setDisplayConfig, ipcRenderer())
                }
            />
        </>
    );
};
