import React, {useEffect, useState} from "react";
import * as Datamap from "datamaps";
import {scaleLog, interpolateTurbo} from 'd3'

import {getCountryData, getAll, getCountryByAgeGroups} from "../api-bridge";
import {BarChart} from "./BarChart";
import {Sunburst} from "./Sunburst";

const Dashboard = () => {
  const [countryData, setCountryData] = useState(null);
  const [generalData, setCountriesData] = useState(null);

  const loadCountryData = async (countryId) => {
    const data = await getCountryData(countryId);
    const dataByAgeGroups = await getCountryByAgeGroups(countryId);
    console.log("Loading data for country: ", countryId, data, dataByAgeGroups);
    setCountryData([data, dataByAgeGroups]);
  };

  const loadCountriesColors = async () => {
    const data = await getAll();

    let cases = Object.entries(data).map(([key, countryData]) => countryData.cases);
    let minValue = Math.min.apply(null, cases),
        maxValue = Math.max.apply(null, cases);

    // create color palette function
    let paletteScale = scaleLog().domain([minValue, maxValue]).range([0, 1, 0.1]); // red color

    // fill dataset in appropriate format
    Object.keys(data).forEach(key => key && (data[key].fillColor = interpolateTurbo(paletteScale(data[key].cases))));
    setCountriesData(data);
  };

  // Execute only on mount
  useEffect(() => {
    loadCountriesColors();
    loadCountryData("ROU"); // Default country
  }, []);

  useEffect(() => {
    const map = new Datamap({
      element: document.getElementById('container'),
      fills: {
        defaultFill: '#c0c0c0'
      },
      data: generalData,
      geographyConfig: {
        popupTemplate: function (geo, data) {
          return ['<div class="hoverinfo">' + geo.properties.name,
            '<br/>' + data.cases + ' Confirmed cases',
            '<br/>' + data.deaths + ' Deaths',
            '<br/>' + data.rate + ' Infection rate per 1000 people',
            '</div>'].join('');
        }
      },
      done: datamap => {
        datamap.svg.selectAll('.datamaps-subunit').on('click', geography => {
          const countryId = geography.id;
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

        <div style={{display: "flex", flexDirection:"column"}}>
          <p className="subtitle">Number of infections heatmap</p>
          <div className="app-card">
            <div className="map-chart">
              <div id="container" style={{position: "relative", height: "100%"}}/>
            </div>
          </div>
        </div>

        <div className="app-row">
          <div className="app-col">
            <p className="subtitle">Evolution of infections/deaths over the weeks</p>
            <div className="app-card small-chart">
              <BarChart data={countryData?.[0]}/>
            </div>
          </div>
          <div className="app-col">
            <p className="subtitle">New cases distribution by age groups</p>
            <div className="app-card small-chart">
              <Sunburst data={countryData?.[1]}/>
            </div>
          </div>
        </div>

      </div>
  )
};

export default Dashboard;