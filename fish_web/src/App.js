import React from 'react';
import 'antd/dist/antd.css';
import { HashRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import Routes from './routes'
import {
    Store as GlobalStore,
    useReduxHook as useGlobalReduxHook,
} from './hook.redux/global'


function GlobalProvider({ children }) {
    const [state, dispatch] = useGlobalReduxHook();
    return (
        <GlobalStore.Provider value={{ state, dispatch }}>
            {children}
        </GlobalStore.Provider>
    );
}

const App = () => {
    return (
        <GlobalProvider>
            <HashRouter>
                <div>
                    {renderRoutes(Routes)}
                </div>
            </HashRouter>
        </GlobalProvider>
    );
};

export default App;
