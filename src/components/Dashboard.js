import React, {useEffect, useState} from "react";
import * as Datamap from "datamaps";
import {scaleLog, interpolateTurbo} from 'd3'

import {getCountryData, getAll} from "../api-bridge";
import {BarChart} from "./BarChart";

const Dashboard = () => {
  const [countryData, setCountryData] = useState(null);
  const [generalData, setCountriesData] = useState(null);

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

  const loadCountriesColors = async () => {
    const data = await getAll();
    console.log("Loading data for all countrie: ", data);
    var keys = Object.keys(data);
    var cases = [];
    keys.forEach(function(key){
      cases.push(data[key].cases);
    });

    var minValue = Math.min.apply(null, cases),
    maxValue = Math.max.apply(null, cases);

    // create color palette function
    // color can be whatever you wish
    var paletteScale = scaleLog().domain([minValue, maxValue]).range([0, 1, 0.1]); // red color

    var dataset = {};
    // fill dataset in appropriate format
    var keys = Object.keys(data);
    keys.forEach(function(key){ //
      var iso = key,
      cases = data[key].cases,
      deaths = data[key].deaths,
      rate = data[key].rate;
      dataset[iso] = { cases: cases, deaths: deaths, rate: rate, fillColor: interpolateTurbo(paletteScale(cases)) };
    });
    setCountriesData(dataset);
  };

  useEffect(() => {
    loadCountriesColors();
    const map = new Datamap({
      element: document.getElementById('container'),
      fills: {
        defaultFill: '#c0c0c0'
      },
      data: generalData,
      geographyConfig: {
        popupTemplate: function(geo, data) {
            return ['<div class="hoverinfo">' + geo.properties.name,
            '<br/>' +  data.cases + ' Confirmed cases',
            '<br/>' +  data.deaths + ' Deaths',
            '<br/>' +  data.rate + ' Infection rate per 1000 people',
            '</div>'].join('');
        }
      },
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