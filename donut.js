const ctx = document.getElementById('donutChart').getContext('2d');
const donutChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Servicios', 'Gastos'],
    datasets: [{
      label: 'Distribución de Gastos',
      data: [22, 78],
      backgroundColor: ['#B0C4B1', '#6B856B'],  // Colores para los segmentos
      hoverOffset: 4
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return tooltipItem.label + ': ' + tooltipItem.raw + '%';
          }
        }
      }
    },
    cutout: '70%', // Para crear el efecto de dona
    rotation: -90, // Para iniciar la rotación desde arriba
  }
});
