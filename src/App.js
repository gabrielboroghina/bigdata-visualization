import './App.css';
import BarChart from "./visualization/BarChart";

function App() {
    return (
        <div className="App">
            <h1>BigData Visualization</h1>
            <BarChart data={[5, 10, 1, 3]} size={[500, 500]}/>
        </div>
    );
}

export default App;
