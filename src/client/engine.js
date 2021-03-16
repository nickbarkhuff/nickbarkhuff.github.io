import React, {useState} from "react";

let image = {};

let vars = [];

const effect = (callback, framerate) => {};

export const engine = ({defaultImage = {}, defaultVars = {}, component}) => {
    return [image, vars, effect];
};

const useEngine = ({defaultImage = {}, defaultVars = {}, component}) => {
    let varsTemp = {};
    defaultVars.forEach(variable => varsTemp[variable.name] = variable.value);
    const [vars, setVars] = useState(varsTemp);

    return [
        Object.assign({}, ...[defaultImage, component(vars)].flat(2)),
        defaultVars.map(variable => ({
            ...variable,
            value: vars[variable.name],
            update: (value) => setVars(prev => ({
                ...prev,
                [variable.name]: variable.type === "int" ? parseInt(value) : value
            }))
        }))
    ];
};

export const layer = () => {};

export const composite = () => {};