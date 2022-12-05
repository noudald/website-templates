const ctx = document.getElementById('calibrationChart');

const data = {
  labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  datasets: [
    {
      label: 'x=y',
      data: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      borderColor: '#4dc9f6',
      backgroundColor: '#4dc9f6',
    },
  ],
};

const chart = new Chart(ctx, {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    maintainAspectRatio: true,
  }
});

chart.data.datasets.push({
  label: 'calibration',
  data: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
  borderColor: '#ff6384',
  backgroundColor: '#ff6384',
});
chart.update();

chart.data.datasets.push({
  label: "Min",
  backgroundColor: 'rgba(255, 99, 132, 0.6)',
  borderColor: 'rgba(255, 99, 132, 1.0)',
  fill: false,
  data: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
});
chart.data.datasets.push({
  label: "Max",
  backgroundColor: 'rgba(255, 99, 132, 0.6)',
  borderColor: 'rgba(255, 99, 132, 1.0)',
  fill: '-1',
  data: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
});
chart.update();
