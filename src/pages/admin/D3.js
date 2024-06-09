import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import styles from './MainComponent.module.css';

const D3BarChart = ({ title, data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous chart

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    svg.attr('width', width).attr('height', height);

    const x = d3.scaleBand()
      .domain(Object.keys(data))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(Object.values(data))])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const xAxis = g => g
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%H:%M")).tickSizeOuter(0));

    const yAxis = g => g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select('.domain').remove());

    svg.append('g')
      .selectAll('rect')
      .data(Object.entries(data))
      .join('rect')
      .attr('x', d => x(d[0]))
      .attr('y', d => y(d[1]))
      .attr('height', d => y(0) - y(d[1]))
      .attr('width', x.bandwidth())
      .attr('fill', 'steelblue');

    svg.append('g')
      .call(xAxis);

    svg.append('g')
      .call(yAxis);

  }, [data]);

  return (
    <div>
      <h2 className={styles.chartTitle}>{title}</h2>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default D3BarChart;
