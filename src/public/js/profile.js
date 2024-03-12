const botonLogout = document.getElementById("botonLogout");

botonLogout.addEventListener("click", (e) => {
  e.preventDefault();

  fetch("/api/jwt/logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => {
      if (result.status === 200) {
        alert("Se ha cerrado la sesión");
      }
    })
    .then(() => {
      window.location.replace("/");
    })
    .catch((error) => {
      console.log(error);
    });
});


