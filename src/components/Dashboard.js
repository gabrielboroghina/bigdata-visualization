import React, {useEffect, useState} from "react";
import * as Datamap from "datamaps";
import {scaleLog, interpolateTurbo} from 'd3'

import {getCountryData, getAll, getCountryByAgeGroups} from "../api-bridge";
import {BarChart} from "./BarChart";
import {Sunburst} from "./Sunburst";

const Dashboard = () => {
  const [countryData, setCountryData] = useState(null);
  const [generalData, setCountriesData] = useState(null);

  const loadCountryData = async (countryId, countryName) => {
    const data = await getCountryData(countryId);
    const dataByAgeGroups = await getCountryByAgeGroups(countryId);
    // console.log("Loading data for country: ", countryId, data, dataByAgeGroups);
    setCountryData({id: countryId, name: countryName, data, dataByAgeGroups});
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
    loadCountryData("ROU", "Romania"); // Default country
  }, []);

  useEffect(() => {
    const map = new Datamap({
      element: document.getElementById('container'),
      fills: {
        defaultFill: '#c0c0c0'
      },
      data: generalData,
      geographyConfig: {
        highlightFillColor: "#c1c1c1",
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
          const countryName = geography.properties.name;
          loadCountryData(countryId, countryName);
        });
      }
    });

    return function cleanup() {
      document.getElementById("container").innerHTML = "";
    };
  });

  const appendCountryName = () => countryData?.name ? ` - ${countryData.name}` : "";

  return (
      <div className="content">

        <div style={{display: "flex", flexDirection: "column"}}>
          <p className="subtitle">Total confirmed cases heatmap</p>
          <div className="app-card">
            <div className="map-chart">

              {/* Legend */}
              <svg width="300" height="50" viewBox="0,0,300,50" style={{overflow: "visible", display: "block"}}>
                <image x="0" y="18" width="320" height="10" preserveAspectRatio="none"
                       href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAABCAYAAAAxWXB3AAABJ0lEQVQ4T32Qy04EQQhFD9DqOOrahUv//xMBA0W1PYlxksq5LxY98v35lYd9cOgbh75jRbs3VV8xuzfVbqjeELshekPtBbFn0KE9I/oENq/1QdoBWrTxRqq2TysqmBKdyWRCamk6i8q19LzWSZTXnDxHb8bp0eh9aoBVHtB3xfVSfekzG6+B7O6iRRzp26IjsnabenpH606cynQ2uv1fJLDaTmcsXey8uXzr/eSid5aV5e9m+2ZgOV1xuqPYfrJTX3wkuvPY20RLj2+dK1t/7dZ1++il/+61K0ppZzFAvDIgEvwfekLtTo6+3lT34K/76TwJh4zh6SFaJxFbQ8zumvv0Pl0zwPs26b7oF12+PqH72RdzNlma1Y1eXHnO52+dwPlKyPL79wPAz2+sJCjVTAAAAABJRU5ErkJggg=="/>
                <g transform="translate(0,28)" fill="none" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
                  <g className="tick" opacity="1" transform="translate(0.5,0)">
                    <line stroke="currentColor" y2="6" y1="-10"/>
                    <text fill="currentColor" y="9" dy="0.71em">1</text>
                  </g>
                  <g className="tick" opacity="1" transform="translate(43.5,0)">
                    <line stroke="currentColor" y2="6" y1="-10"/>
                    <text fill="currentColor" y="9" dy="0.71em">10</text>
                  </g>
                  <g className="tick" opacity="1" transform="translate(87.5,0)">
                    <line stroke="currentColor" y2="6" y1="-10"/>
                    <text fill="currentColor" y="9" dy="0.71em">100</text>
                  </g>
                  <g className="tick" opacity="1" transform="translate(130.5,0)">
                    <line stroke="currentColor" y2="6" y1="-10"/>
                    <text fill="currentColor" y="9" dy="0.71em">1k</text>
                  </g>
                  <g className="tick" opacity="1" transform="translate(173.5,0)">
                    <line stroke="currentColor" y2="6" y1="-10"/>
                    <text fill="currentColor" y="9" dy="0.71em">10k</text>
                  </g>
                  <g className="tick" opacity="1" transform="translate(217.5,0)">
                    <line stroke="currentColor" y2="6" y1="-10"/>
                    <text fill="currentColor" y="9" dy="0.71em">100k</text>
                  </g>
                  <g className="tick" opacity="1" transform="translate(260.5,0)">
                    <line stroke="currentColor" y2="6" y1="-10"/>
                    <text fill="currentColor" y="9" dy="0.71em">1M</text>
                  </g>
                  <g className="tick" opacity="1" transform="translate(303.5,0)">
                    <line stroke="currentColor" y2="6" y1="-10"/>
                    <text fill="currentColor" y="9" dy="0.71em">10M</text>
                  </g>
                </g>
              </svg>

              {/* World map */}
              <div id="container" style={{position: "relative", height: "100%"}}/>
            </div>
          </div>
        </div>

        <div className="app-row">
          <div className="app-col">
            <p className="subtitle">Evolution of infections/deaths {appendCountryName()}</p>
            <div className="app-card small-chart">
              <BarChart data={countryData?.data}/>
            </div>
          </div>
          <div className="app-col">
            <p className="subtitle">New cases distribution by age groups {appendCountryName()}</p>
            <div className="app-card small-chart">
              <Sunburst data={countryData?.dataByAgeGroups}/>
            </div>
          </div>
        </div>

      </div>
  )
};

export default Dashboard;