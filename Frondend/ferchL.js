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
  const message = await response.text();
  alert(message); // Muestra la respuesta del backend
});