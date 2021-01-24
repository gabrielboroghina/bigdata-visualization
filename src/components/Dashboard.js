import React, {useEffect, useState} from "react";
import * as Datamap from "datamaps";
import {BarChart} from "./BarChart";
import {getCountryData} from "../api-bridge";

const Dashboard = () => {
  const [countryData, setCountryData] = useState(null);

  // const [dimensions, setDimensions] = useState({
  //   height: window.innerHeight,
  //   width: window.innerWidth
  // });
  // useEffect(() => {
  //   const handleResize = () => setDimensions({
  //     height: window.innerHeight,
  //     width: window.innerWidth
  //   });
  //   window.addEventListener('resize', handleResize);
  // });

  const loadCountryData = async (countryId) => {
    const data = await getCountryData(countryId);
    console.log("Loading data for country: ", countryId, data);
    setCountryData(data);
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

    return function cleanup() {
      document.getElementById("container").innerHTML = "";
    };
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
            <div className="app-card" style={{padding: "10px 10px 20px 10px", height: 400}}>
              <BarChart data={countryData}/>
            </div>
          </div>
          <div className="app-col">
            <div className="app-card">
            </div>
          </div>
        </div>

      </div>
  )
};

export default Dashboard;