import React, {useState, useEffect, useRef} from "react";

import {engine} from "./engine.js";
import {project, size, matrixFlat} from "./project.js";

const [onImageUpdate, onVarUpdate] = engine(project);

const Matrix = (props) => {
    const i = props.image;
    return matrixFlat
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

    // Settings
    const framerateMin = 1;
    const framerateMax = 250;
    const [framerate, setFramerate] = useState(60);

    const [showBorders, setShowBorders] = useState(true);
    const [showCircles, setShowCircles] = useState(true);
    const [showIds, setShowIds] = useState(false);

    const defaultEndpoint = "http://foobar.dev";
    const [realEndpoint, setRealEndpoint] = useState(defaultEndpoint);
    const [realMounted, setRealMounted] = useState(false);
    const exampleEndpoint = realEndpoint || defaultEndpoint;

    // Resize Window
    const ref = useRef();
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

    // Image
    const [image, setImage] = useState({});
    useEffect(() => {
        return onImageUpdate((newImage) => {
            setImage(newImage);
            if(realMounted){
                console.log("Updating real matrix");
            }
        }, framerate);
    }, [framerate, realEndpoint, realMounted]);

    // Vars
    const [vars, setVars] = useState([]);
    useEffect(() => {
        return onVarUpdate((newVars) => setVars(newVars));
    }, []);

    return (
        <div className={"ff1 c1 bg1 hFull dFlex"}>
            <div className={"bg2 p2 flex1 ofAuto"}>
                <h1 className={"taCenter fwBold fs3"}>DreamPixel</h1>
                <h2 className={"taCenter fsItalic pb1"}>Proof-of-concept</h2>
                <div className={"pb2"}>
                    <p className={"pb1"}>
                        Virtual {size}x{size} LED matrix. Scroll down to the "state" section and play with the variables.
                    </p>
                    <p className={"pb1"}>
                        Can also control a real matrix of the same size; just enter the API endpoint and click the mount button to start sending network requests.
                    </p>
                    <p className={"pb1"}>The framerate setting affects both the real matrix (if mounted) and the virtual matrix.</p>
                    <p className={"pb1"}>
                        If your endpoint is <span className={"fwBold"}>
                            <a href={exampleEndpoint}>{exampleEndpoint}</a>
                        </span>, the generated network requests will look like this:
                    </p>
                    <p className={"fwBold"}><a href={`${exampleEndpoint}/brightness/45/0`}>{exampleEndpoint}/brightness/45/0</a></p>
                    <p className={"pb1"}>Turn LED 45 off (0 brightness)</p>
                    <p className={"fwBold"}><a href={`${exampleEndpoint}/brightness/45/255`}>{exampleEndpoint}/brightness/45/255</a></p>
                    <p className={"pb1"}>Turn LED 45 to full brightness</p>
                    <p className={"fwBold"}><a href={`${exampleEndpoint}/color/45/255/0/0`}>{exampleEndpoint}/color/45/255/0/0</a></p>
                    <p className={"pb1"}>Make LED 45 red</p>
                    <p className={"fwBold"}><a href={`${exampleEndpoint}/color/45/0/0/255`}>{exampleEndpoint}/color/45/0/0/255</a></p>
                    <p>Make LED 45 blue</p>
                </div>
                <h3 className={"taCenter fwBold fs2 pb1"}>Settings</h3>
                <div className={"pb2"}>
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
                    <div className={"pb1"}>
                        <label>
                            Framerate: {framerate}
                            <br/>
                            <input
                                type="range"
                                min={framerateMin}
                                max={framerateMax}
                                value={framerate}
                                onChange={e => setFramerate(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className={"pb1"}>
                        <label>
                            Endpoint: <input
                            type="text"
                            value={realEndpoint}
                            onChange={e => setRealEndpoint(e.target.value)}
                        />
                        </label>
                    </div>
                    <div>
                        <button onClick={() => setRealMounted(!realMounted)}>
                            {realMounted ? "Mounted (click to unmount)" : "Unmounted (click to mount)"}
                        </button>
                    </div>
                </div>
                <h3 className={"taCenter fwBold fs2 pb1"}>State</h3>
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