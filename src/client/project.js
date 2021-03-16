import {layer, composite} from "./engine.js";

export const size = 24;
const halfSize = size / 2;
const matrixArray1D = [...Array(size).keys()];
const matrixArrayYX = matrixArray1D.map(x => {
    const row = matrixArray1D.map(y => (x * size) + y);
    return !(x % 2) ? row : row.reverse();
});
const matrixArrayXY = matrixArray1D.map(y =>
    matrixArray1D.map(x =>
        matrixArrayYX[x][y]
    )
);
const matrixXY = (x, y) => {
    if(matrixArrayXY[x] !== undefined && matrixArrayXY[x][y] !== undefined)
        return matrixArrayXY[x][y];
    else
        return -1;
};
export const matrixFlat = matrixArrayYX.flat();

const rect = (a, b, x, y) => {
    const width = x - a + 1;
    const height = y - b + 1;
    if(width < 1 || height < 1)
        return [];
    let curX = a;
    let curY = b;
    let ret = [];
    while(!(curX === x && curY === y)){
        ret.push(matrixXY(curX, curY));
        if(curX === x){
            curX = a;
            curY++;
        }
        else{
            curX++;
        }
    }
    ret.push(matrixXY(curX, curY));
    return ret;
};

const idsToPixels = (ids) => ids.map(id =>
    [`LED${id}_R`, `LED${id}_G`, `LED${id}_B`, `LED${id}_A`, `LED${id}_ON`]
);

const i = {
    r: (value = 0) => matrixFlat.map(id => ({
        [`LED${id}_R`]: value
    })),
    g: (value = 0) => matrixFlat.map(id => ({
        [`LED${id}_G`]: value
    })),
    b: (value = 0) => matrixFlat.map(id => ({
        [`LED${id}_B`]: value
    })),
    a: (value = 0) => matrixFlat.map(id => ({
        [`LED${id}_A`]: value
    })),
    on: (value = false) => matrixFlat.map(id => ({
        [`LED${id}_ON`]: value
    })),
    center: (value = 0) => {
        const topLeft = halfSize - value;
        const bottomRight = halfSize + value - 1;
        return rect(topLeft, topLeft, bottomRight, bottomRight).map(id => ({
            [`LED${id}_ON`]: true
        }));
    }
};

const m = {
    center: (value = 0) => {
        const topLeft = halfSize - value;
        const bottomRight = halfSize + value - 1;
        return idsToPixels(rect(topLeft, topLeft, bottomRight, bottomRight));
    }
};

const main = (vars) => {
    return [
        i.r(255),
        i.g(0),
        i.b(0),
        i.a(255),
        i.center(vars["foo"])
    ];
    // return layer({
    //     mask: m.center(vars["foo"]),
    //     images: [
    //         i.r(255),
    //         i.g(0),
    //         i.b(0),
    //         i.a(255),
    //         i.on(true)
    //     ]
    // });
};

export const project = {
    component: main,
    framerate: 60,
    onChange: (pixels) => {
        console.log(pixels);
    },
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
        max: halfSize
    }, {
        name: "bar",
        type: "int",
        value: 0,
        min: 0,
        max: 255
    }, {
        name: "baz",
        type: "bool",
        value: false
    }]
};