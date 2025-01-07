import React, { useEffect, useRef } from "react";
import { Bar,Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chart.js/auto";


// Register the necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ labels, label_1, label_2, data1, data2 }) => {
  // Define the data for the bar chart


  const data = {
    labels: labels,
    datasets: [
      {
        label: label_1,
        data: data1,
        backgroundColor: ["rgba(255, 159, 64, 0.2)"],
        borderColor: ["rgba(255, 159, 64, 1)"],
        borderWidth: 2,
        yAxisID: "y1",
      },
      {
        label: label_2,
        data: data2,
        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 2,
        yAxisID: "y2",
      },
    ],
  };

  // Define the options for the chart (e.g., axes configuration)
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: "Bar Chart Example",
        font: {
          size: 20,
          weight: "bold",
          family: "Arial",
          lineHeight: 1.2,
          color: "#000000",

        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
      legend: {
        position: "bottom",
        labels: {
          color: "white",
        },
      },
    },
    scales: {
     
      y1: {
        beginAtZero: false,
        position: "left",
        ticks: {
          color: "rgba(75, 192, 192, 1)", // Tick color for y1
        },
        title: {
          display: true,
          text: "Orders",
          color: "rgba(75, 192, 192, 1)",
        },
      },
      y2: {
        beginAtZero: true,
        position: "right",
        ticks: {
          color: "rgba(255, 99, 132, 1)", // Tick color for y2
        },
        title: {
          display: true,
          text: "Revenue",
          color: "rgba(255, 99, 132, 1)",
        },
        grid: {
          drawOnChartArea: false, // Avoid overlapping grid lines
        },
      },

      x: {
        grid: {
            display: false,

        },
        ticks: {
          color: "white", // Set x-axis tick color (e.g., red)
        },
      }
    },
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-3 text-white">{`${label_1} & ${label_2}`}</h2>
      <Bar  data={data} options={options} />
    </div>
  );
};

export const DoughnutChart = ({ labels, data , color}) => {
  
  
  const doughtnutData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: color,
      }
    ]

  }

  const doughtnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'white'
        }
      },
      title: {
        display: false,
        text: 'Doughnut Chart',
      },
    }

  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-3 text-white"></h2>
      <Doughnut key={2} data={doughtnutData} options={doughtnutOptions} />
    </div>
  );

};

export default BarChart;
