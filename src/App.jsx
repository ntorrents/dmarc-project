import "./App.css";
import Header from "./views/Header/Header";
import Services from "./views/Services";
import Analysis from "./views/Analysis/Analysis";
import Plans from "./views/Plans";
import Contact from "./views/Contact";
import Footer from "./views/Footer";

function App() {
    return (
        <div className="App">
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
