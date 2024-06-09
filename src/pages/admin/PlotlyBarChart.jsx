import React, { useEffect, useRef, useMemo } from 'react';
import Plotly from 'plotly.js-basic-dist';
import styles from './MainComponent.module.css';

const PlotlyBarChart = ({ title, data }) => {
  const chartRef = useRef(null);

  const chartData = useMemo(() => [
    {
      x: Object.keys(data),
      y: Object.values(data),
      type: 'bar',
      marker: {
        color: 'rgba(75, 192, 192, 0.2)',
        line: {
          color: 'rgba(75, 192, 192, 1)',
          width: 1.5,
        },
      },
    },
  ], [data]);

  useEffect(() => {
    const currentChartRef = chartRef.current;
    const layout = {
      title: title,
      xaxis: {
        title: 'Time',
      },
      yaxis: {
        title: 'Value',
      },
      margin: { t: 30, l: 50, r: 30, b: 50 },
    };

    const config = {
      displayModeBar: true,
      responsive: true,
    };

    if (currentChartRef) {
      Plotly.react(currentChartRef, chartData, layout, config);
    }

    return () => {
      if (currentChartRef) {
        Plotly.purge(currentChartRef);
      }
    };
  }, [chartData, title]);

  return <div ref={chartRef} className={styles.chart}></div>;
};

export default PlotlyBarChart;
