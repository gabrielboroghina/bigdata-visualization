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
    const margin = {top: 20, right: 30, bottom: 34, left: 0}
    const height = 500;
    const width = 500;

    const delay = 250;
    const data = this.props.data;
    if (!data) return;

    const weekStep = 1;
    const weekMin = 0;

    const color = d3.scaleOrdinal(["M", "F"], ["#4e79a7", "#e15759"]);

    console.log(data);
    console.log(Array.from(d3.group(data, d => d.year_week).keys()));
    const x = d3.scaleBand()
        .domain(Array.from(d3.group(data, d => d.year_week).keys()).sort(d3.ascending))
        .range([width - margin.right, margin.left]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.cases_weekly)])
        .range([height - margin.bottom, margin.top]);

    const yAxis = g => g
        .attr("transform", `translate(${width - margin.right},0)`)
        .call(d3.axisRight(y).ticks(null, "s"))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", margin.right)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text("Number of cases"));

    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x)
            .tickValues(d3.ticks(...d3.extent(data, d => d.year_week), width / 40))
            .tickSizeOuter(0))
        .call(g => g.append("text")
            .attr("x", margin.right)
            .attr("y", margin.bottom - 4)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text("Week"));

    const svg = d3.select(this.node);

    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);
    const group = svg.append("g");
    let rect = group.selectAll("rect");

    this.node = Object.assign(svg.node(), {
      update(week) {
        const dx = x.step() * (week - weekMin) / weekStep;

        const t = svg.transition()
            .ease(d3.easeLinear)
            .duration(delay);

        rect = rect
            .data(data.filter(d => d.year === week), d => `${d.sex}:${d.year - d.age}`)
            .join(
                enter => enter.append("rect")
                    .style("mix-blend-mode", "darken")
                    .attr("fill", d => color(d.sex))
                    .attr("x", d => x(d.year_week) + dx)
                    .attr("y", d => y(0))
                    .attr("width", x.bandwidth() - 1)
                    .attr("height", 0),
                update => update,
                exit => exit.call(rect => rect.transition(t).remove()
                    .attr("y", y(0))
                    .attr("height", 0))
            );

        rect.transition(t)
            .attr("y", d => y(d.cases_weekly))
            .attr("height", d => y(0) - y(d.cases_weekly));

        group.transition(t)
            .attr("transform", `translate(${-dx},0)`);
      }
    });

    this.node.update(2000);
  }

  render() {
    return (
        <svg ref={node => this.node = node} viewBox="0 0 500 300" preserveAspectRatio="xMidYMid meet"/>
    )
  }
}
