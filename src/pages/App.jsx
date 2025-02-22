import "./App.css";
import Services from "../views/Services";
import Analysis from "../views/Analysis/Analysis";
import Plans from "../views/Plans";
import HomeContact from "../views/HomeContact";
import Intro from "../views/Intro/Intro";
import Summary from "../views/Summary";

function App() {
	return (
		<div className="App">
			<Intro />
			<Services />
			<Analysis />
			<Plans />
			<Summary />
			<HomeContact />
		</div>
	);
}

export default App;
