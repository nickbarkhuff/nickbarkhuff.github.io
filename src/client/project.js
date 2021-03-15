import {layer, composite} from "./engine.js";

export const size = 24;
export const matrix = [...Array(size**2).keys()];
const odd = !!(size % 2);
const half = Math.ceil(size/2);

const coordFromId = (id) => [id % size, Math.floor(id / size)];
const idFromCoord = (x, y) => x + (y * size);
const rect = (a, b, x, y) => {
    const width = x - a + 1;
    const height = y - b + 1;
    if(width < 1 || height < 1)
        return [];
    let curX = a;
    let curY = b;
    let ret = [];
    while(!(curX === x && curY === y)){
        ret.push(idFromCoord(curX, curY));
        if(curX === x){
            curX = a;
            curY++;
        }
        else{
            curX++;
        }
    }
    ret.push(idFromCoord(curX, curY));
    return ret;
};

const i = {
    r: (value = 0) => matrix.map(id => ({
        [`LED${id}_R`]: value
    })),
    g: (value = 0) => matrix.map(id => ({
        [`LED${id}_G`]: value
    })),
    b: (value = 0) => matrix.map(id => ({
        [`LED${id}_B`]: value
    })),
    a: (value = 0) => matrix.map(id => ({
        [`LED${id}_A`]: value
    })),
    on: (value = false) => matrix.map(id => ({
        [`LED${id}_ON`]: value
    })),
    center: (value = 0) => {
        const topLeft = (half - 1) - (value - 1);
        const bottomRight = (half - 1) + (value - (odd ? 1 : 0));
        return rect(topLeft, topLeft, bottomRight, bottomRight).map(id => ({
            [`LED${id}_ON`]: true
        }));
    }
};

const g = [];

const main = (vars) => {
    return [
        i.r(255),
        i.g(0),
        i.b(0),
        i.a(255),
        i.center(vars["foo"])
    ];
};

export const project = {
    defaultImage: [
        i.r(0),
        i.g(0),
        i.b(0),
        i.a(0),
        i.on(false)
    ],
    defaultVars: [{
        name: "foo",
        type: "int",
        value: 0,
        min: 0,
        max: half
    }, {
        name: "bar",
        type: "int",
        value: 0,
        min: 0,
        max: 255
    }, {
        name: "baz",
        type: "int",
        value: 0,
        min: 0,
        max: 255
    }, {
        name: "quas",
        type: "bool",
        value: false
    }],
    component: main
};