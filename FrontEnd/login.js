document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();
  
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
  
    if (email && password) {
      const loginEndpoint = "http://localhost:5678/api/users/login";
      const loginData = { email, password };
  
  
      fetch(loginEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Login failed");
          }
        })
        .then((data) => {
          console.log("Login successful");
          console.log(data);
          // Store the token in localStorage
          localStorage.setItem("authToken", data.token);
          // Redirect to the home page
          window.location.href = "index.html"; // Replace with the desired home page URL
        })
        .catch((error) => {
          console.error("Login failed:", error.message);
          // Show an error message to the user
          showError("Erreur dans l’identifiant ou le mot de passe");
        });
        //responsible for handling the case where either the email or password (or both) are empty
    } else {
      console.error("Invalid email or password");
      showError("Invalid email or password");
    }
  });
  
  
  function showError(errorMessage) {
    // Create a new div element for the error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = errorMessage;
  
  
    const form = document.getElementById("form");
    const submitButton = form.querySelector(".login-btn");

    // Insert the error message div before the submit button
    form.insertBefore(errorDiv, submitButton);
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    emailInput.addEventListener('input', removeErrorMessage);
    passwordInput.addEventListener('input', removeErrorMessage);
    
    // Function to remove the error message
    function removeErrorMessage() {
        const errorDiv = document.querySelector('.error-message');
        
        // Check if the error message div exists before attempting to remove it
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
  }
  
  
  