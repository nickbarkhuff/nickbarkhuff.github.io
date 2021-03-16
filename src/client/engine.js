let state = {
    vars: [],
    onVarUpdate: undefined
};

const actions = {
    setVars: (state, {defaultVars}, dispatch) => {
        let newState = state;
        newState.vars = defaultVars.map(variable => ({
            ...variable,
            update: (value) => dispatch("updateVar", {name: variable.name, value})
        }));
        return newState;
    },
    setOnVarUpdate: (state, {cb}) => {
        let newState = state;
        newState.onVarUpdate = cb;
        newState.onVarUpdate(state.vars);
        return newState;
    },
    updateVar: (state, {name, value}) => {
        let newState = state;
        newState.vars.filter(variable => variable.name === name)[0].value = value;
        if(state.onVarUpdate)
            state.onVarUpdate(newState.vars);
        return newState;
    }
};

const dispatch = (action, data) => {
    if(actions[action])
        state = actions[action](state, data, dispatch);
    else
        console.error(`No such action: ${action}`);
};

export const engine = ({defaultImage = {}, defaultVars = [], component}) => {
    dispatch("setVars", {defaultVars})
    const onImageUpdate = (cb, framerate) => {};
    const onVarUpdate = (cb) => {
        dispatch("setOnVarUpdate", {cb});
    };
    return [onImageUpdate, onVarUpdate];
};

export const layer = () => {};

export const composite = () => {};

// const useEngine = ({defaultImage = {}, defaultVars = {}, component}) => {
//     let varsTemp = {};
//     defaultVars.forEach(variable => varsTemp[variable.name] = variable.value);
//     const [vars, setVars] = useState(varsTemp);
//
//     return [
//         Object.assign({}, ...[defaultImage, component(vars)].flat(2)),
//         defaultVars.map(variable => ({
//             ...variable,
//             value: vars[variable.name],
//             update: (value) => setVars(prev => ({
//                 ...prev,
//                 [variable.name]: variable.type === "int" ? parseInt(value) : value
//             }))
//         }))
//     ];
// };