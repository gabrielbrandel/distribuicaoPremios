const playersInput = document.getElementById("players");
const entryInput = document.getElementById("entry");
const feeInput = document.getElementById("fee");
const winnersPercentInput = document.getElementById("winnersPercent");

playersInput.addEventListener("input", render);
entryInput.addEventListener("input", render);
feeInput.addEventListener("input", render);
winnersPercentInput.addEventListener("input", render);

function render() {
  const players = Math.max(1, Number(playersInput.value));
  const entry = Math.max(0.01, Number(entryInput.value));
  const fee = Math.min(100, Math.max(0, Number(feeInput.value))) / 100;

  const poolTotal = players * entry;
  const taxa = poolTotal * fee;
  const poolDistribuivel = poolTotal - taxa;
  const winnersPercent = Math.min(100, Math.max(1, Number(winnersPercentInput.value)));
  const winners = Math.max(1, Math.ceil(players * (winnersPercent / 100)));

  document.getElementById("poolTotal").innerText =
    `R$ ${poolTotal.toFixed(2)}`;
  document.getElementById("taxaCasa").innerText =
    `R$ ${taxa.toFixed(2)}`;
  document.getElementById("poolDistribuivel").innerText =
    `R$ ${poolDistribuivel.toFixed(2)}`;

  renderPercentual(poolDistribuivel, winners);
  renderEscada(poolDistribuivel, entry, winners);
}

/* =========================
   MODELO 3 — PERCENTUAL
========================= */
function renderPercentual(pool, winners) {
  const table = document.getElementById("tablePercentual");
  const totalEl = document.getElementById("totalPercentual");

  table.innerHTML = `
    <tr>
      <th>Posição</th>
      <th>Prêmio (R$)</th>
      <th>% do Pool</th>
    </tr>
  `;

  // Gera pesos decrescentes (ex: 5,4,3,2,1)
  let pesos = [];
  for (let i = winners; i >= 1; i--) {
    pesos.push(i);
  }

  // Aumenta peso do topo (top-heavy)
  pesos[0] *= 2;           // 1º mais forte
  if (pesos.length > 1) {
    pesos[1] *= 1.4;       // 2º
  }
  if (pesos.length > 2) {
    pesos[2] *= 1.2;       // 3º
  }

  const somaPesos = pesos.reduce((a, b) => a + b, 0);

  let totalDistribuido = 0;

  pesos.forEach((peso, index) => {
    const valor = pool * (peso / somaPesos);
    totalDistribuido += valor;

    table.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>R$ ${valor.toFixed(2)}</td>
        <td>${((valor / pool) * 100).toFixed(2)}%</td>
      </tr>
    `;
  });

  totalEl.innerText =
    `Total distribuído: R$ ${totalDistribuido.toFixed(2)}`;
}


/* =========================
   MODELO 4 — ESCADA
========================= */
function renderEscada(pool, entry, winners) {
  const table = document.getElementById("tableMultiplicador");
  const totalEl = document.getElementById("totalMultiplicador");

  table.innerHTML = `
    <tr>
      <th>Posição</th>
      <th>Prêmio (R$)</th>
      <th>Peso na Divisão</th>
    </tr>
  `;

  let multipliers = [];

  for (let i = 1; i <= winners; i++) {
    if (i === 1) multipliers.push(10);
    else if (i === 2) multipliers.push(7);
    else if (i === 3) multipliers.push(5);
    else if (i === 4) multipliers.push(4);
    else if (i === 5) multipliers.push(3);
    else {
      const last = multipliers[multipliers.length - 1];
      multipliers.push(Math.max(1, last - 0.5));
    }
  }

  const soma = multipliers.reduce((a, b) => a + b, 0);
  const valorPorPonto = pool / soma;

  let total = 0;

  multipliers.forEach((m, i) => {
    const premio = m * valorPorPonto;
    total += premio;

    table.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>R$ ${premio.toFixed(2)}</td>
        <td>${m.toFixed(2)}x</td>
      </tr>
    `;
  });

  totalEl.innerText = `Total distribuído: R$ ${total.toFixed(2)}`;
}

// Inicial
render();
