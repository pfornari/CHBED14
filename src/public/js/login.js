// import config from "../../config/config.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));


  fetch("/api/jwt/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => {
      if (result.status === 200) {
        result.json()
                .then(json => {
                    console.log("Data: " + data)
                    console.log("Cookies generadas:");
                    console.log(document.cookie);
                     alert("Usuario conectado");
                   
                    return window.location.replace("/users/products");
                })
    
      }
      else if (result.status === 201) {

                    console.log("Data: " + data)
                    console.log("Cookies generadas:");
                    console.log(document.cookie);
                     alert("Usuario conectado");
                    
                     return window.location.replace("/api/products");
                     
                    
             
      }
      else {
        alert("Credenciales incorrectas");
      }
    
    })
    .catch((error) => {
      alert("credenciales incorrectas, inténtelo nuevamente");
      console.log(error);
    });
});

