import * as d3 from 'd3';
import React, {Component} from "react";

export class BarChart extends Component {
  constructor(props) {
    super(props);
    this.createBarChart = this.createBarChart.bind(this);
  }

  componentDidMount() {
    this.createBarChart()
  }

  componentDidUpdate() {
    this.createBarChart()
  }

  createBarChart() {
    this.node.innerHTML = ''; // clear the chart before drawing new data

    const margin = {top: 20, right: 10, bottom: 34, left: 60}
    const height = 400;
    const width = 600;

    const data = this.props.data;
    if (!data) return;

    const color = d3.scaleOrdinal(["M", "F"], ["#4e79a7", "#e15759"]);

    let weekToId = {};
    data.forEach((d, i) => weekToId[d.year_week] = i);

    const x = d3.scaleLinear()
        .domain([1, data.length])
        .range([margin.left, width - margin.right]);
    console.log([0, d3.max(data, d => d.cases)])
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.cases)]).nice()
        .range([height - margin.bottom, margin.top]);

    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 20).tickSizeOuter(0))
        .call(g => g.append("text")
            .attr("x", width - margin.right)
            .attr("y", 30)
            .attr("fill", "currentColor")
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .text("Week"));

    const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(height / 40))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 4)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text("Number of cases"));

    const svg = d3.select(this.node)
        // Responsive SVG needs these 2 attributes and no width and height attr.
        .attr("preserveAspectRatio", "none")
        .attr("viewBox", "0 0 600 400")
        .attr("height", "100%")
        .attr("width", "100%")
        // Class to make it responsive.
        .classed("svg-content-responsive", true);

    svg.append("g")
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => x(weekToId[d.year_week]) + 1)
        .attr("width", d => Math.max(0, x(weekToId[d.year_week] + 1) - x(weekToId[d.year_week]) - 1))
        .attr("y", d => y(d.cases))
        .attr("height", d => y(0) - y(d.cases));

    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);
  }

  render() {
    return (
        <div className="svg-container">
          <svg ref={node => this.node = node}/>
        </div>
    )
  }
}
