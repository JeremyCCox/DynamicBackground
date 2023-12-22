import {BrowserRouter, Routes, Route} from "react-router-dom";
import "./static/styles.css"
import DynamicBackground from "./LayoutComps/DynamicBackground/DynamicBackground";

function App(){
    return(
        <>
            <BrowserRouter>
                <Routes>
                    <Route path={"/*"} element={
                        <DynamicBackground/>
                    }>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );

}export default App;