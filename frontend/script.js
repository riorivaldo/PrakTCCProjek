const BASE_URL = "http://localhost:5000";

// Cek token di localStorage, jika tidak ada redirect ke login
const token = localStorage.getItem("token");
if (!token) {
  alert("Silakan login terlebih dahulu.");
  window.location.href = "login.html";
}

// Mengambil elemen form
const formulir = document.querySelector("form");

// Trigger event submit pada elemen form
formulir.addEventListener("submit", (e) => {
  e.preventDefault();

  // Mengambil elemen input
  const elemen_tanggal = document.querySelector("#tanggal");
  const elemen_isi = document.querySelector("#isi");

  // Mengambil value dari elemen input
  const tanggal = elemen_tanggal.value;
  const isi = elemen_isi.value;

  const id = elemen_tanggal.dataset.id; // Khusus untuk edit

  // Header Authorization dengan token JWT
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Mengecek apakah harus POST atau PUT
  // Jika ID kosong, akan menggunakan POST untuk menambah data baru
  if (!id) {
    // Tambah diary
    axios
      .post(`${BASE_URL}/add-keuangan`, { tanggal, isi }, config)
      .then(() => {
        // Bersihkan form setelah submit
        elemen_tanggal.value = "";
        elemen_isi.value = "";

        // Panggil fungsi getDiary untuk memuat ulang daftar diary
        getDiary();
      })
      .catch((error) => console.log(error.message)); // Jika ada error
  } else {
    // Jika ada ID, lakukan PUT untuk memperbarui diary yang ada
    axios
      .put(`${BASE_URL}/edit-keuangan/${id}`, { tanggal, isi }, config)
      .then(() => {
        // Bersihkan form setelah submit
        elemen_tanggal.dataset.id = "";
        elemen_tanggal.value = "";
        elemen_isi.value = "";

        // Panggil fungsi getDiary untuk memuat ulang daftar diary
        getDiary();
      })
      .catch((error) => console.log(error)); // Jika ada error
  }
});

// Fungsi untuk mengambil daftar diary (GET)
async function getDiary() {
  try {
    const { data } = await axios.get(`${BASE_URL}/keuangan`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const table = document.querySelector("#diary-list");
    let tampilan = "";
    let no = 1;

    // Loop untuk menampilkan semua diary
    for (const diary of data) {
      tampilan += tampilkanDiary(no, diary);
      no++;
    }
    table.innerHTML = tampilan; // Memperbarui daftar diary yang ditampilkan

    // Panggil fungsi hapusDiary dan editDiary untuk menangani aksi
    hapusDiary();
    editDiary();
  } catch (error) {
    console.log(error.message);
  }
}

// Fungsi untuk menampilkan diary
function tampilkanDiary(no, diary) {
  return `
    <div class="diary-entry">
      <h3>${diary.tanggal}</h3>
      <p>${diary.isi}</p>
      <button data-id="${diary.id}" class='btn-edit'>Edit</button>
      <button data-id="${diary.id}" class='btn-hapus'>Hapus</button>
    </div>
  `;
}

// Fungsi untuk menghapus diary
function hapusDiary() {
  const kumpulan_tombol_hapus = document.querySelectorAll(".btn-hapus");

  kumpulan_tombol_hapus.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      axios
        .delete(`${BASE_URL}/delete-keuangan/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => getDiary()) // Memuat ulang daftar diary setelah penghapusan
        .catch((error) => console.log(error));
    });
  });
}

// Fungsi untuk mengedit diary
function editDiary() {
  const kumpulan_tombol_edit = document.querySelectorAll(".btn-edit");

  kumpulan_tombol_edit.forEach((tombol_edit) => {
    tombol_edit.addEventListener("click", () => {
      // Mengambil data yang ada di baris yang dipilih
      const id = tombol_edit.dataset.id;
      const tanggal = tombol_edit.parentElement.querySelector("h3").innerText;
      const isi = tombol_edit.parentElement.querySelector("p").innerText;

      // Mengisi form dengan data yang dipilih
      const elemen_tanggal = document.querySelector("#tanggal");
      const elemen_isi = document.querySelector("#isi");

      elemen_tanggal.dataset.id = id;
      elemen_tanggal.value = tanggal;
      elemen_isi.value = isi;
    });
  });
}

// Panggil getDiary saat halaman pertama kali dimuat untuk menampilkan semua diary
getDiary();
