import "./App.css";
import Header from "./views/Header/Header";
import Services from "./views/Services";
import Analysis from "./views/Analysis/Analysis";
import Plans from "./views/Plans";
import Contact from "./views/Contact";
import Footer from "./views/Footer";
import Intro from "./views/Intro/Intro";

function App() {
    return (
        <div className="App">
            <Intro />
            <Header />
            <Services />
            <Analysis />
            <Plans />
            <Contact />
            <Footer />
        </div>
    );
}

export default App;
