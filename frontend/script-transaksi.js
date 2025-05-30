const BASE_URL = "http://localhost:5000";
const USER_ID = localStorage.getItem("user_id");
const token = localStorage.getItem("token");

if (!token || !USER_ID) {
  alert("Silakan login terlebih dahulu.");
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user_id");
  window.location.href = "login.html";
}

document.getElementById("logout-btn")?.addEventListener("click", logout);

const form = document.getElementById("form-transaksi");
const submitButton = form.querySelector("button[type='submit']");
let currentId = null;
let lastData = [];

async function loadCategories() {
  try {
    const res = await axios.get(`${BASE_URL}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const categories = res.data;
    const categorySelect = document.getElementById("category_id");
    categorySelect.innerHTML = '<option value="">Pilih Kategori</option>';
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  } catch (err) {
    console.error("Gagal ambil kategori:", err);
  }
}

async function getTransactions() {
  try {
    const res = await axios.get(`${BASE_URL}/transactions/${USER_ID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = res.data;
    lastData = data;

    const listIncome = document.getElementById("list-income");
    const listExpense = document.getElementById("list-expense");

    listIncome.innerHTML = "<h3></h3>";
    listExpense.innerHTML = "<h3></h3>";

    if (data.length === 0) {
      listIncome.innerHTML += "<p>Tidak ada pemasukan.</p>";
      listExpense.innerHTML += "<p>Tidak ada pengeluaran.</p>";
      tampilkanRingkasan([]);
      return;
    }

    data.forEach((trx) => {
      const kategori = trx.category ? trx.category.name : "-";
      const div = document.createElement("div");
      div.className = `relative transaction ${trx.type} p-4 mb-3 bg-white shadow rounded`;

      div.innerHTML = `
  <div>
    <p class="font-semibold">${trx.tanggal}</p>
    <p>Rp${Number(trx.amount).toLocaleString()} - ${
        trx.description
      } <em class="text-gray-500">(${kategori})</em></p>
  </div>
  <div class="trx-actions absolute bottom-2 right-2 flex gap-2 text-sm">
    <button onclick="editTransaction(${
      trx.id
    })" class="text-black-500 hover:text-blue-700">✏️ Edit</button>
    <button onclick="deleteTransaction(${
      trx.id
    })" class="text-red-500 hover:text-red-700">🗑️ Hapus</button>
  </div>
`;

      if (trx.type === "income") {
        listIncome.appendChild(div);
      } else {
        listExpense.appendChild(div);
      }
    });

    tampilkanRingkasan(data);
  } catch (err) {
    console.error("Gagal ambil transaksi:", err);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    user_id: USER_ID,
    tanggal: document.getElementById("tanggal").value,
    type: document.getElementById("type").value,
    amount: document.getElementById("amount").value,
    description: document.getElementById("description").value,
    category_id: document.getElementById("category_id").value,
  };

  if (!data.tanggal || !data.type || !data.amount || !data.category_id) {
    alert("Harap lengkapi semua kolom.");
    return;
  }

  if (parseFloat(data.amount) <= 0) {
    alert("Jumlah harus lebih dari 0.");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = currentId ? "Menyimpan..." : "Menambahkan...";

  try {
    if (currentId) {
      await axios.put(`${BASE_URL}/transactions/${currentId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      currentId = null;
    } else {
      await axios.post(`${BASE_URL}/transactions`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    form.reset();
    submitButton.textContent = "Simpan";
    getTransactions();
    window.scrollTo({ top: 0, behavior: "smooth" });
    alert("Transaksi berhasil disimpan.");
  } catch (err) {
    console.error("Gagal simpan:", err);
    alert("Gagal menyimpan transaksi.");
  } finally {
    submitButton.disabled = false;
  }
});

async function deleteTransaction(id) {
  if (!confirm("Yakin ingin menghapus transaksi ini?")) return;

  try {
    await axios.delete(`${BASE_URL}/transactions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    getTransactions();
  } catch (err) {
    console.error("Gagal hapus:", err);
  }
}

function editTransaction(id) {
  const trx = lastData.find((t) => t.id === id);
  if (!trx) return;

  document.getElementById("tanggal").value = trx.tanggal;
  document.getElementById("type").value = trx.type;
  document.getElementById("amount").value = trx.amount;
  document.getElementById("description").value = trx.description;
  document.getElementById("category_id").value = trx.category_id;
  currentId = id;
  submitButton.textContent = "Update";
}

function tampilkanRingkasan(data) {
  let income = 0;
  let expense = 0;

  data.forEach((trx) => {
    if (trx.type === "income") income += parseFloat(trx.amount);
    else if (trx.type === "expense") expense += parseFloat(trx.amount);
  });

  const saldo = income - expense;

  document.getElementById("total-income").textContent =
    "Rp" + income.toLocaleString();
  document.getElementById("total-expense").textContent =
    "Rp" + expense.toLocaleString();
  document.getElementById("saldo-akhir").textContent =
    "Rp" + saldo.toLocaleString();
}

loadCategories();
getTransactions();
