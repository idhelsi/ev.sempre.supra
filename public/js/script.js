document.addEventListener("DOMContentLoaded", function () {
  const associadoSection = document.querySelector("#associado");
  const terceiroSection = document.querySelector("#terceiro");
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  const image = new Image();
  const drawnCircles = [];
  const CIRCLE_RADIUS = 15;
  const CIRCLE_COLOR = "rgba(255, 0, 0, 1)";
  const areas = document.querySelectorAll("area");

  image.src = "https://sempresupra.com.br/wp-content/uploads/2021/01/carro.jpg";

  // Carregar imagem e ajustar tamanho do canvas
  image.onload = function () {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
  };

  // Mostrar/ocultar seções
  document.querySelectorAll('input[name="tipo"]').forEach(function (e) {
      e.addEventListener("change", function () {
          const isAssociado = this.value === "Associado";
          associadoSection.style.display = isAssociado ? "block" : "none";
          terceiroSection.style.display = isAssociado ? "none" : "block";
      });
  });

  document.querySelectorAll('input[name="radio4"]').forEach(function (radio) {
      radio.addEventListener("change", function () {
          const isSim = this.value === "Sim";
          const pergunta4Div = document.querySelector('.pergunta4');

          if (isSim) {
              pergunta4Div.style.display = "block";
          } else {
              pergunta4Div.style.display = "none";
          }
      });
  });

  document.querySelectorAll('input[name="radio5"]').forEach(function (radio) {
      radio.addEventListener("change", function () {
          const isSim = this.value === "Sim";
          const pergunta5Div = document.querySelector('.pergunta5');

          if (isSim) {
              pergunta5Div.style.display = "block";
          } else {
              pergunta5Div.style.display = "none";
          }
      });
  });

  document.querySelectorAll('input[name="radio6"]').forEach(function (radio) {
      radio.addEventListener("change", function () {
          const isSim = this.value === "Sim";
          const pergunta6Div = document.querySelector('.pergunta6');

          if (isSim) {
              pergunta6Div.style.display = "block";
          } else {
              pergunta6Div.style.display = "none";
          }
      });
  });

  document.querySelectorAll('input[name="radio11"]').forEach(function (radio) {
      radio.addEventListener("change", function () {
        const esim = this.value === "Sim";
        const pergunta11Div = document.querySelector('.pergunta11');
        
        if (esim) {
          pergunta11Div.style.display = "block";
        } else {
          pergunta11Div.style.display = "none";
        }
      });
    });  

  // Mostrar/ocultar campos de pessoas
  document.querySelectorAll('input[name="pessoas"]').forEach(function (elem) {
      elem.addEventListener("change", function () {
          const numPessoas = parseInt(this.value);
          for (let i = 1; i <= 4; i++) {
              const pessoaDiv = document.getElementById(`pessoa${i}`);
              if (pessoaDiv) {
                  pessoaDiv.style.display = i <= numPessoas ? "block" : "none";
              }
          }
      });
  });

  // Desenhar círculo
  function drawCircle(x, y) {
      ctx.beginPath();
      ctx.arc(x, y, CIRCLE_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = CIRCLE_COLOR;
      ctx.fill();
  }

  // Limpar círculo
  function clearCircle(x, y) {
      ctx.clearRect(
          x - CIRCLE_RADIUS,
          y - CIRCLE_RADIUS,
          CIRCLE_RADIUS * 2,
          CIRCLE_RADIUS * 2
      );
      ctx.drawImage(
          image,
          x - CIRCLE_RADIUS,
          y - CIRCLE_RADIUS,
          CIRCLE_RADIUS * 2,
          CIRCLE_RADIUS * 2,
          x - CIRCLE_RADIUS,
          y - CIRCLE_RADIUS,
          CIRCLE_RADIUS * 2,
          CIRCLE_RADIUS * 2
      );
  }

  // Verificar se o clique está dentro do círculo
  function isClickInCircle(mouseX, mouseY, x, y) {
      return (
          mouseX >= x - CIRCLE_RADIUS &&
          mouseX <= x + CIRCLE_RADIUS &&
          mouseY >= y - CIRCLE_RADIUS &&
          mouseY <= y + CIRCLE_RADIUS
      );
  }

  // Lidar com o clique no canvas
  canvas.addEventListener("click", function (event) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      areas.forEach(function (area) {
          const [x, y] = area.coords.split(",").map(Number);
          const dataKey = area.getAttribute("data-key");

          if (isClickInCircle(mouseX, mouseY, x, y)) {
              const circleIndex = drawnCircles.findIndex(
                  (circle) => circle.x === x && circle.y === y
              );
              if (circleIndex !== -1) {
                  clearCircle(x, y);
                  drawnCircles.splice(circleIndex, 1);
              } else {
                  drawCircle(x, y);
                  drawnCircles.push({ x, y });
              }

              // Marcar/desmarcar a checkbox correspondente
              const checkbox = document.querySelector(
                  `input[type="checkbox"][data-key="${dataKey}"]`
              );
              if (checkbox) {
                  checkbox.checked = !checkbox.checked;
              }
          }
      });
  });

  // Lidar com a mudança na checkbox
  function updateCanvasFromCheckbox(checkbox) {
      const isChecked = checkbox.checked;
      const dataKey = checkbox.getAttribute("data-key");

      areas.forEach(function (area) {
          if (area.getAttribute("data-key") === dataKey) {
              const [x, y] = area.coords.split(",").map(Number);
              if (isChecked) {
                  drawCircle(x, y);
                  drawnCircles.push({ x, y });
              } else {
                  const circleIndex = drawnCircles.findIndex(
                      (circle) => circle.x === x && circle.y === y
                  );
                  if (circleIndex !== -1) {
                      clearCircle(x, y);
                      drawnCircles.splice(circleIndex, 1);
                  }
              }
          }
      });
  }

  // Lidar com mudanças nas checkboxes
  document
      .querySelectorAll('input[type="checkbox"]')
      .forEach(function (checkbox) {
          checkbox.addEventListener("change", function () {
              updateCanvasFromCheckbox(checkbox);
          });
      });

  // Enviar print da tela
  document.getElementById("submit-btn").addEventListener("click", function () {
      html2canvas(document.body).then(function (canvas) {
          const image = canvas.toDataURL("image/png");

          fetch("/send-email", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ image }),
          })
              .then(function (response) {
                  return response.json();
              })
              .then(function (data) {
                  if (data.success) {
                      alert("Screenshot enviado por e-mail com sucesso!");
                  } else {
                      alert("Erro ao enviar o screenshot por e-mail.");
                  }
              })
              .catch(function (error) {
                  console.error("Erro:", error);
                  alert("Erro ao enviar o screenshot por e-mail.");
              });
      });
  });
});