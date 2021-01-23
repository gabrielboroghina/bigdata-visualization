import React, {useEffect} from "react";
import * as Datamap from "datamaps";

// import BarChart from "./visualization/BarChart";
// import {ChartComp} from "./visualization/visualization";

const Dashboard = () => {
  const loadCountryData = async (countryId) => {
    console.log("Loading data for country: ", countryId);
  };

  useEffect(() => {
    const map = new Datamap({
      element: document.getElementById('container'),
      done: datamap => {
        datamap.svg.selectAll('.datamaps-subunit').on('click', geography => {
          const countryId = geography.id;
          const countryName = geography.properties.name;
          loadCountryData(countryId);
        });
      }
    });
  });

  return (
      <div className="content">
        <div className="app-card">
          <div className="map-chart">
            <div id="container" style={{position: "relative", height: "100%"}}/>
          </div>
        </div>

        <div className="app-row">
          <div className="app-col">
            <div className="app-card">
              chart
            </div>
          </div>
          <div className="app-col">
            <div className="app-card">
              chart
            </div>
          </div>
        </div>
      </div>
  )
};

export default Dashboard;