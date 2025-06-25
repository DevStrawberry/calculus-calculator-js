// frontend/src/components/FunctionGraph.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registra os componentes do Chart.js que vamos usar
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function FunctionGraph({ graphData, functionLabel }) {
  if (!graphData || graphData.labels.length === 0) {
    return null; // Não renderiza nada se não houver dados
  }

  const data = {
    labels: graphData.labels, // Pontos do eixo X
    datasets: [
      {
        label: `f(x) = ${functionLabel}`, // O rótulo da linha
        data: graphData.data, // Pontos do eixo Y
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1, // Deixa a linha um pouco curva
        pointRadius: 1, // Tamanho dos pontos
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gráfico da Função',
        font: {
            size: 18
        }
      },
    },
    scales: {
        y: {
            title: {
                display: true,
                text: 'f(x)'
            },
            grace: '5%'
        },
        x: {
            title: {
                display: true,
                text: 'x'
            }
        }
    }
  };

  return <Line options={options} data={data} />;
}

export default FunctionGraph;