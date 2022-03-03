import {Card} from "@blueprintjs/core";
import {Line} from "react-chartjs-2";
import React from 'react';
import Chart from 'chart.js/auto';

const produceChartData = (rawData) => {
  let result =  rawData.map((data) => ({
    data: data.value,
    label: data.sensorName,
    fill: false,
    borderColor: data.color
  }));
  return result
};

function DataChart({header, data, timestamp}) {
  return (
    <Card style={{marginBottom: 20}}>
      <Line
        height={100}
        data={{
          labels: timestamp,
          datasets: produceChartData(data),
        }}
        options={{
          title: {
            display: true,
            text: header,
            fontSize: 25
          },
          legend: {
            display: true,
            position: "bottom"
          }
        }}
      />
    </Card>
  );
}

export default DataChart;