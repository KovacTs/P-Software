
  // Enviar datos de registro al backend
  const registerForm = document.getElementById('registerForm');
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const lastname  = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const response = await fetch('http://localhost:3000/Crear-cuenta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, lastname, email, password, confirmPassword }),
    });
    const message = await response.text();
    alert(message); // Muestra la respuesta del backend
  });

