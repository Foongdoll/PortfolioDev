import { lazy } from "react";
import { Route } from "react-router-dom";

const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));
const Projects = lazy(() => import("../pages/Projects"));
const TechLog = lazy(() => import("../pages/TechLog"));

export default function CommonRouter() {

    return (
        <>        
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />            
            <Route path="/projects" element={<Projects />} />
            <Route path="/techlog" element={<TechLog />} />
        </>
    )
}
