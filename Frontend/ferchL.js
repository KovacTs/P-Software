// Enviar datos de inicio de sesión al backend
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const response = await fetch('http://localhost:3000/Iniciar-sesion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (response.redirected) {
    // Si hay una redirección, cambiar la ubicación
    window.location.href = response.url;
  } else {
    const message = await response.text();
    alert(message); // Muestra el mensaje de error si no hubo redirección
  }
});
