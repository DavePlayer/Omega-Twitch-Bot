import React, { useContext } from "react";
import { Form, Field, FieldRenderProps } from "react-final-form";
import { consoleContext } from "../App";
import { ipcRenderer } from "electron";

const Input: React.ComponentType<FieldRenderProps<any>> = (props) => {
    return (
        <input
            {...props.input}
            {...props.inputProps}
            type={props.input.type}
            className={props.className}
            id={props.input.id}
            min={props.min}
            max={props.max}
            placeholder={props.placeholder}
        />
    );
};

const checkLength = (value: number) => {
    if (!value || value <= 0) {
        return "wypełnij coś debilu";
    }
    return undefined;
};

export const handleSubmit = (e: any, Console: consoleContext) => {
    console.log(e);
    Console.log(`Updating timer: ${JSON.stringify(e)}`);
    if (e && e.fontSize) {
        ipcRenderer.send("timer:updateFont", e);
    } else {
        ipcRenderer.send("timer:updateClock", e);
    }
};

export const Inputs: React.FC = () => {
    const Console: consoleContext = useContext(consoleContext);
    return (
        <>
            <Form
                name="timer"
                render={({ handleSubmit }) => (
                    <>
                        <form action="#" onSubmit={(e) => handleSubmit(e)}>
                            <section>
                                <Field
                                    parse={(n: string) => parseInt(n)}
                                    name="hours"
                                    type="number"
                                    defaultValue={0}
                                    id="hours"
                                    min={0}
                                    max={23}
                                    className="time"
                                    component={Input}
                                />
                                <Field
                                    parse={(n: string) => parseInt(n)}
                                    name="minutes"
                                    className="time"
                                    defaultValue={0}
                                    min={0}
                                    max={59}
                                    type="number"
                                    id="minutes"
                                    component={Input}
                                />
                                <Field
                                    parse={(n: string) => parseInt(n)}
                                    name="seconds"
                                    className="time"
                                    defaultValue={0}
                                    min={0}
                                    max={59}
                                    type="number"
                                    id="seconds"
                                    component={Input}
                                />
                                {/* <input type="number" className="time" />
                            <input type="number" className="time" min="0" max="59" value="0" name="" id="minutes" />
                            <input type="number" className="time" min="0" max="59" value="0" name="" id="seconds" /> */}
                            </section>
                            <button type="submit">Update Time</button>
                        </form>
                        <br />
                    </>
                )}
                onSubmit={(e) => handleSubmit(e, Console)}
            />
            <Form
                name="font"
                render={({ handleSubmit }) => (
                    <>
                        <form
                            onSubmit={(e) => handleSubmit(e)}
                            action="#"
                            method="get"
                            id="fontForm"
                        >
                            <section>
                                <Field
                                    parse={(n: string) => parseInt(n)}
                                    name="fontSize"
                                    type="number"
                                    id="fontSize"
                                    min="1"
                                    validate={checkLength}
                                    component={Input}
                                    placeholder="rozmiar czcionki"
                                />
                                {/* <input
                                type="number"
                                defaultValue=""
                                id="font"
                            /> */}
                            </section>
                            <button type="submit">Update Font Size</button>
                        </form>
                    </>
                )}
                onSubmit={(e) => handleSubmit(e, Console)}
            />
        </>
    );
};
