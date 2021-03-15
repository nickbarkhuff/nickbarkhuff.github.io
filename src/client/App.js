import React, {useState, useEffect, useRef} from "react";

import {useEngine} from "./engine.js";
import {project, size, matrix} from "./project.js";

const Matrix = (props) => {
    const i = props.image;
    return matrix
        .map(id => (
            <div
                key={id}
                className={"ofHidden"}
                style={{
                    flexBasis: `calc(100% * (1/${size}))`,
                    padding: props.circles ? "2px" : "0"
                }}
            >
                <div
                    className={"hFull"}
                    style={{
                        borderRadius: props.circles ? "50%" : "0",
                        border: props.borders ? "1px solid white" : "none",
                        backgroundColor: `rgba(${i[`LED${id}_R`]}, ${i[`LED${id}_G`]}, ${i[`LED${id}_B`]}, ${i[`LED${id}_ON`] ? i[`LED${id}_A`] / 255 : 0})`
                    }}
                >
                    {props.ids ? id : null}
                </div>
            </div>
        ));
};

export const App = () => {
    const [image, vars] = useEngine(project);

    const ref = useRef();
    const [showBorders, setShowBorders] = useState(false);
    const [showCircles, setShowCircles] = useState(true);
    const [showIds, setShowIds] = useState(false);

    const [dimensions, setDimensions] = useState({
        height: 0,
        width: 0
    });

    const handleResize = () => {
        const height = ref.current.offsetHeight;
        const width = ref.current.offsetWidth;
        const smaller = height < width ? height : width;
        setDimensions({
            height: smaller,
            width: smaller
        });
    };

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className={"ff1 c1 bg1 hFull dFlex"}>
            <div className={"bg2 p2 flex1 ofAuto"}>
                <h1 className={"taCenter fwBold fs3"}>DreamPixel</h1>
                <h2 className={"taCenter pb1 fsItalic"}>Proof-of-concept Demo</h2>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={showBorders}
                            onChange={e => setShowBorders(e.target.checked)}
                        />
                        Borders
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={showCircles}
                            onChange={e => setShowCircles(e.target.checked)}
                        />
                        Circles
                    </label>
                </div>
                <div className={"pb1"}>
                    <label>
                        <input
                            type="checkbox"
                            checked={showIds}
                            onChange={e => setShowIds(e.target.checked)}
                        />
                        IDs
                    </label>
                </div>
                <div className={"pb2"}>
                    (description)
                </div>
                <h3 className={"taCenter pb1 fwBold fs2"}>Animations</h3>
                <div className={"pb2"}>
                    (animations)
                </div>
                <h3 className={"taCenter pb1 fwBold fs2"}>State</h3>
                <div>
                    {vars.map(variable => (
                        <div className={"pb1"}>
                            <label>
                                {variable.name}: {variable.type === "bool" ? (variable.value ? "true" : "false") : variable.value}
                                <br/>
                                {variable.type === "bool" ? (
                                    <input
                                        type="checkbox"
                                        checked={variable.value}
                                        onChange={e => variable.update(e.target.checked)}/>
                                ) : null}
                                {variable.type === "int" ? (
                                    <input
                                        type="range"
                                        min={variable.min}
                                        max={variable.max}
                                        value={variable.value}
                                        onChange={e => variable.update(e.target.value)}/>
                                ) : null}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <div className={"p2 flex3 ofHidden"}>
                <div ref={ref} className={"hFull dFlex jcCenter aiCenter"}>
                    <div className={"dFlex fwWrap"} style={{height: dimensions.height, width: dimensions.width}}>
                        <Matrix image={image} borders={showBorders} circles={showCircles} ids={showIds}/>
                    </div>
                </div>
            </div>
        </div>
    );
};