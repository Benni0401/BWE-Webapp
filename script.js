
document.addEventListener("DOMContentLoaded", () => {
  const materialData = {
    "PLA Basic": { price: 25, density: 1.24 },
    "PLA Matte": { price: 27, density: 1.24 },
    "PLA-CF": { price: 35, density: 1.22 },
    "ABS": { price: 30, density: 1.04 },
    "ASA": { price: 35, density: 1.07 },
    "PETG": { price: 29, density: 1.27 },
    "PETG-CF": { price: 39, density: 1.27 },
    "TPU 95A": { price: 32, density: 1.21 },
    "PA-CF": { price: 60, density: 1.15 },
    "PAHT-CF": { price: 54, density: 1.25 },
    "ABS-GF": { price: 35, density: 1.20 },
    "PC": { price: 40, density: 1.20 },
    "PC-CF": { price: 55, density: 1.23 },
    "PET-CF": { price: 42, density: 1.25 },
    "PLA Silk": { price: 30, density: 1.25 }
  };

  const materialSelect = document.getElementById("material");
  const priceInput = document.getElementById("pricePerKg");

  for (const key in materialData) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    materialSelect.appendChild(option);
  }

  materialSelect.addEventListener("change", () => {
    const selected = materialSelect.value;
    if (materialData[selected]) {
      priceInput.value = materialData[selected].price;
    }
  });

  document.getElementById("calculateButton").addEventListener("click", () => {
    const name = document.getElementById("customerName").value;
    const email = document.getElementById("customerEmail").value;
    const weight = parseFloat(document.getElementById("weight").value) || 0;
    const pricePerKg = parseFloat(document.getElementById("pricePerKg").value) || 0;
    const hours = parseFloat(document.getElementById("hours").value) || 0;
    const rate = parseFloat(document.getElementById("rate").value) || 0;
    const scanEffort = parseFloat(document.getElementById("scanEffort").value) || 0;
    const scanPost = parseFloat(document.getElementById("scanPost").value) || 0;

    const materialCost = weight * pricePerKg;
    const printCost = hours * rate;
    const scanCost = scanEffort + scanPost;
    const total = materialCost + printCost + scanCost;

    const resultHtml = `
      <h3>Angebot</h3>
      <p><strong>Kunde:</strong> ${name}<br>
      <strong>E-Mail:</strong> ${email}</p>
      <p><strong>Materialkosten:</strong> €${materialCost.toFixed(2)}</p>
      <p><strong>Druckkosten:</strong> €${printCost.toFixed(2)}</p>
      <p><strong>3D-Scan:</strong> €${scanCost.toFixed(2)}</p>
      <p><strong>Gesamtkosten:</strong> <strong>€${total.toFixed(2)}</strong></p>
    `;
    document.getElementById("result").innerHTML = resultHtml;
  });

  document.getElementById("exportPdfButton").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const now = new Date();
    const name = document.getElementById("customerName").value;
    const email = document.getElementById("customerEmail").value;
    const resultText = document.getElementById("result").innerText;

    doc.text("3D-Druck Angebot", 10, 10);
    doc.text(`Datum: ${now.toLocaleDateString()}`, 10, 20);
    doc.text(`Kunde: ${name}`, 10, 30);
    doc.text(`E-Mail: ${email}`, 10, 40);

    const lines = doc.splitTextToSize(resultText, 180);
    doc.text(lines, 10, 60);

    doc.save("Angebot_3D-Druck.pdf");
  });
});
