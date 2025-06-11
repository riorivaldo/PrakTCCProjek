const BASE_URL = "https://note-be056-371739253078.us-central1.run.app";
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

const form = document.getElementById("form-kategori");
const inputNama = document.getElementById("nama-kategori");
const inputId = document.getElementById("kategori-id");
const daftarKategori = document.getElementById("daftar-kategori");
const submitBtn = document.getElementById("submit-btn");

async function fetchKategori() {
  try {
    const res = await axios.get(`${BASE_URL}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    daftarKategori.innerHTML = "";
    res.data.forEach((kat) => {
      const div = document.createElement("div");
      div.className = "kategori-item";
      div.innerHTML = `
        <strong>${kat.name}</strong>
        <div class="actions">
          <button class="icon-btn edit" title="Edit" onclick="editKategori(${kat.id}, '${kat.name}')">
            <i class="fa fa-pencil"></i>
          </button>
          <button class="icon-btn delete" title="Hapus" onclick="hapusKategori(${kat.id})">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      `;
      daftarKategori.appendChild(div);
    });
  } catch (err) {
    console.error("Gagal memuat kategori:", err);
  }
}

window.editKategori = function (id, nama) {
  inputId.value = id;
  inputNama.value = nama;
  submitBtn.textContent = "Update";
};

window.hapusKategori = async function (id) {
  if (!confirm("Yakin ingin menghapus kategori ini?")) return;

  try {
    await axios.delete(`${BASE_URL}/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchKategori();
  } catch (err) {
    console.error("Gagal menghapus kategori:", err);
    alert("Gagal menghapus kategori.");
  }
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = inputId.value;
  const nama = inputNama.value.trim();
  if (!nama) return alert("Nama kategori tidak boleh kosong.");

  try {
    if (id) {
      await axios.put(`${BASE_URL}/categories/${id}`, { name: nama }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post(`${BASE_URL}/categories`, { name: nama }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    form.reset();
    inputId.value = "";
    submitBtn.textContent = "Simpan";
    fetchKategori();
  } catch (err) {
    console.error("Gagal menyimpan kategori:", err);
    alert("Gagal menyimpan kategori.");
  }
});

fetchKategori();
