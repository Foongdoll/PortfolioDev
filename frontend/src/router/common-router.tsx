import { Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Contract from "../pages/Contract";
import Experience from "../pages/Experience";
import Projects from "../pages/Projects";
import TechLog from "../pages/TechLog";

export default function CommonRouter() {

    return (
        <>        
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contract" element={<Contract />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/techlog" element={<TechLog />} />
        </>
    )
}