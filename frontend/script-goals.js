(() => {
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

  const form = document.getElementById("form-goal");
  const submitButton = form.querySelector("button[type='submit']");
  const goalList = document.getElementById("goal-list");
  let currentId = null;
  let lastData = [];

  async function getGoals() {
    try {
      const res = await axios.get(`${BASE_URL}/goals/${USER_ID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      lastData = res.data;

      if (!goalList) return;

      if (lastData.length === 0) {
        goalList.innerHTML =
          "<p class='text-gray-600'>Belum ada target keuangan.</p>";
        return;
      }

      goalList.innerHTML = "";
      lastData.forEach((goal) => {
        const progress = Math.min(
          (goal.current_amount / goal.target_amount) * 100,
          100
        ).toFixed(0);

        const div = document.createElement("div");
        div.className = "relative bg-white shadow rounded p-4";

        div.innerHTML = `
          <h3 class="text-lg font-bold text-gray-800 mb-1">${goal.name}</h3>
          <p class="text-sm text-gray-600 mb-1">Target: Rp${Number(
            goal.target_amount
          ).toLocaleString()}</p>
          <p class="text-sm text-gray-600 mb-1">Terkumpul: Rp${Number(
            goal.current_amount
          ).toLocaleString()}</p>
          <p class="text-sm text-gray-600 mb-4">Batas Waktu: <span class="font-medium">${
            goal.due_date
          }</span></p>

          <div class="w-full bg-gray-200 rounded-full h-3 mb-3">
            <div class="bg-blue-600 h-3 rounded-full" style="width: ${progress}%"></div>
          </div>
          <p class="text-sm text-right text-gray-500">${progress}% tercapai</p>

          <div class="absolute top-2 right-2 flex gap-2 text-xl">
            <button class="text-blue-500 hover:text-blue-700" title="Edit" onclick="editGoal(${
              goal.id
            })">
              <i class="fa fa-pencil-alt"></i>
            </button>
            <button class="text-red-500 hover:text-red-700" title="Hapus" onclick="deleteGoal(${
              goal.id
            })">
              <i class="fa fa-trash"></i>
            </button>
          </div>
        `;

        goalList.appendChild(div);
      });
    } catch (error) {
      console.error("Gagal ambil target:", error);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      user_id: USER_ID,
      name: document.getElementById("name").value.trim(),
      target_amount: document.getElementById("target_amount").value,
      current_amount: document.getElementById("current_amount").value,
      due_date: document.getElementById("due_date").value,
    };

    if (!data.name || !data.target_amount || !data.due_date) {
      alert("Harap lengkapi semua kolom wajib.");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = currentId ? "Menyimpan..." : "Menambahkan...";

    try {
      if (currentId) {
        await axios.put(`${BASE_URL}/goals/${currentId}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        currentId = null;
      } else {
        await axios.post(`${BASE_URL}/goals`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      form.reset();
      submitButton.textContent = "Simpan";
      getGoals();
      alert("Target keuangan berhasil disimpan.");
    } catch (error) {
      console.error("Gagal simpan target:", error);
      alert("Gagal menyimpan target.");
    } finally {
      submitButton.disabled = false;
    }
  });

  window.editGoal = function (id) {
    const goal = lastData.find((g) => g.id === id);
    if (!goal) return;

    document.getElementById("name").value = goal.name;
    document.getElementById("target_amount").value = goal.target_amount;
    document.getElementById("current_amount").value = goal.current_amount;
    document.getElementById("due_date").value = goal.due_date;
    currentId = id;
    submitButton.textContent = "Update";
  };

  window.deleteGoal = async function (id) {
    if (!confirm("Yakin ingin menghapus target ini?")) return;

    try {
      await axios.delete(`${BASE_URL}/goals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      getGoals();
    } catch (error) {
      console.error("Gagal hapus target:", error);
      alert("Gagal menghapus target.");
    }
  };

  getGoals();
})();
