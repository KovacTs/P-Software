setInterval(async () => {
    try {
      const response = await fetch('/MoneyWase', {
        method: 'GET',
        credentials: 'include'
      });
  
      if (response.redirected) {
        // Si la respuesta redirige, enviarlo a la página de inicio de sesión
        window.location.href = response.url;
      }
    } catch (error) {
      console.error('Error verificando la sesión:', error);
    }
  }, 5000); // Verificar cada 5 segundos, ajustar según sea necesario
  