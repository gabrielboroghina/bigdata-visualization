import './App.css';
import React from "react";
import virusIcon from "./virus-icon.svg";
import Dashboard from "./components/Dashboard";

function App() {
  return (
      <div className="App">

        <header className="header">
          <img src={virusIcon} height={60}/>
          <div className="title">COVID-19 BigData visualization</div>
        </header>

        <Dashboard/>

        <footer className="footer">
          <div className="centerBox">
            <div className="column">
              <h5 className="footer-text">COVID-19</h5>
              <p style={{margin: "0 0"}}>
                Copyright &copy; {new Date().getFullYear()}. All rights reserved.
              </p>
            </div>
            <div className="column" style={{width: 200}}/>
            <div className="column">
              <h5 className="footer-text">Contact</h5>
              <p style={{fontSize: "small", margin: "0 0"}}>
                Email: <a href='mailto:'>covid19@gmail.com</a>
                <br/>
                Tel: <a href='tel:'>+40123456789</a>
              </p>
            </div>
          </div>
        </footer>

      </div>
  );
}

export default App;
