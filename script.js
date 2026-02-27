// REGISTRA SERVICE WORKER
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

// DATI
let products = JSON.parse(localStorage.getItem("products")) || [];
let editIndex = null;

// RENDER
function renderProducts() {
  const list = document.getElementById("productList");
  const lowList = document.getElementById("lowStockList");
  const filter = document.getElementById("searchInput").value.toLowerCase();

  list.innerHTML = "";
  lowList.innerHTML = "";

  products.forEach((product, index) => {
    const nameMatch = product.name.toLowerCase().includes(filter);
    const categoryMatch = product.category.toLowerCase().includes(filter);

    if (!nameMatch && !categoryMatch) return;

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${product.name}</strong><br>
      Categoria: ${product.category}<br>
      Quantità: ${product.quantity} ${product.unit}<br>
      Minimo: ${product.minQuantity}
      <br>
      <button onclick="changeQty(${index}, -1)">-1</button>
      <button onclick="changeQty(${index}, 1)">+1</button>
      <button onclick="editProduct(${index})">Modifica</button>
      <button onclick="deleteProduct(${index})">Elimina</button>
    `;

    if (product.quantity <= product.minQuantity) {
      li.classList.add("low");
      lowList.appendChild(li.cloneNode(true));
    }

    list.appendChild(li);
  });
}

// MODALE
const modal = document.getElementById("modal");
const addBtn = document.getElementById("addBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

addBtn.addEventListener("click", openForm);
cancelBtn.addEventListener("click", closeForm);
saveBtn.addEventListener("click", saveProduct);

function openForm() {
  modal.classList.remove("hidden");
  document.getElementById("modalTitle").innerText = editIndex === null ? "Nuovo Prodotto" : "Modifica Prodotto";
}

function closeForm() {
  modal.classList.add("hidden");
  editIndex = null;
}

// SALVA / AGGIORNA
function saveProduct() {
  const name = document.getElementById("name").value;
  const category = document.getElementById("category").value;
  const quantity = parseInt(document.getElementById("quantity").value);
  const minQuantity = parseInt(document.getElementById("minQuantity").value);
  const unit = document.getElementById("unit").value;

  if (!name || !category || isNaN(quantity) || isNaN(minQuantity)) return;

  const productData = { name, category, quantity, minQuantity, unit };

  if (editIndex !== null) {
    products[editIndex] = productData;
  } else {
    products.push(productData);
  }

  clearForm();
  renderProducts();
  closeForm();
}

function editProduct(index) {
  const product = products[index];
  document.getElementById("name").value = product.name;
  document.getElementById("category").value = product.category;
  document.getElementById("quantity").value = product.quantity;
  document.getElementById("minQuantity").value = product.minQuantity;
  document.getElementById("unit").value = product.unit;

  editIndex = index;
  openForm();
}

function changeQty(index, amount) {
  products[index].quantity += amount;
  if (products[index].quantity < 0) products[index].quantity = 0;
  renderProducts();
}

function deleteProduct(index) {
  products.splice(index, 1);
  renderProducts();
}

function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("category").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("minQuantity").value = "";
  document.getElementById("unit").value = "";
}

// RICERCA
document.getElementById("searchInput").addEventListener("input", renderProducts);

renderProducts();