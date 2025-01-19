import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Filler,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
  plugins,
  scales,
} from "chart.js";
import { getlastsevendays } from "../../libs/features";
ChartJS.register(
  Tooltip,
  Filler,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend
);

const linechartoptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

const LineChart = ({ value = [] }) => {
  const labels = getlastsevendays();
  const data = {
    labels: labels,
    datasets: [
      {
        data: value,
        label: "Messages",
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgb(173, 75, 192)",
      },
    ],
  };
  return <Line data={data} />;
};
const doughnutchartoptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  cutout: 120,
};
const DougnutChart = ({ value = [], labels = [] }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        data: value,
        fill: true,
        backgroundColor: ["rgb(10, 231, 231)", "rgb(231, 173, 87)"],
        borderColor: "rgb(173, 75, 192)",
        offset: 15,
      },
    ],
  };
  return (
    <Doughnut
      style={{ zIndex: 10 }}
      data={data}
      options={doughnutchartoptions}
    />
  );
};
export { LineChart, DougnutChart };
