import React from 'react';
import Plot from 'react-plotly.js';

const GaugeIndicator = ({ parameter, value }) => {
  const getColor = (value) => {
    if (value < 30) return 'green';
    if (value < 60) return 'yellow';
    return 'red';
  };

  return (
    <Plot
      data={[
        {
          type: "indicator",
          mode: "gauge+number",
          value: value,
          gauge: {
            axis: { range: [0, 100] },
            bar: { color: getColor(value) },
            steps: [
              { range: [0, 30], color: "green" },
              { range: [30, 60], color: "yellow" },
              { range: [60, 100], color: "red" }
            ]
          }
        }
      ]}
      layout={{ width: 300, height: 300, margin: { t: 25, r: 25, l: 25, b: 25 }, title: { text: parameter.toUpperCase() } }}
      config={{ responsive: true }}
    />
  );
};

export default GaugeIndicator;
