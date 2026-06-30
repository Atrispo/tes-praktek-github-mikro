// const LAYANAN = ["SKA", "CKA", "TNM", "PDA"];

// function formatTanggal(dateStr) {
//     const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
//     const d = new Date(dateStr);
//     return d.getDate() + ' ' + bulan[d.getMonth()] + ' ' + d.getFullYear();
// }

// function validasiForm() {
//     const nama = document.getElementById('nama').value;
//     const nim = document.getElementById('nim').value;
//     const prodi = document.getElementById('prodi').value;
//     const layanan = document.getElementById('layanan').value;
//     const tanggal = document.getElementById('tanggal').value;

//     if (nama === '' || nim === '' || prodi === '' || layanan === '' || tanggal === '') {
//         alert('semua filed wajib diisi');
//         return false;
//     }

//     if (nama.length <= 3) {
//         alert("nama terlalu pendek");
//         return false;
//     }

//     if (nim.length !== 8 || isNaN(nim)) {
//         alert('NIM harus terdiri dari 8 digit angka murni!');
//         return false;
//     }

//     alert('Pengajuan Berhasil!\n\n' +
//         'Nama : '+ nama +'\n' +
//         'NIM : '+ nim +'\n' +
//         'Prodi : '+ prodi +'\n' +
//         'Layanan : '+ layanan +'\n' +
//         'Tanggal : '+ formatTanggal(tanggal))

//     return true;

//     console.log("Data Pengajuan:", {
//         nama: nama,
//         nim: nim,
//         prodi: prodi,
//         layanan: layanan,
//         tanggal: formatTanggal(tanggal)
//     });

//     return false;
// }

function getData() {
  const raw = localStorage.getItem("sila_data");
  return raw ? JSON.parse(raw) : [];
}

function saveData(data) {
  localStorage.setItem("sila_data", JSON.stringify(data));
}

function formatTanggal(dateStr) {
  const bulan = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const d = new Date(dateStr);
  return d.getDate() + " " + bulan[d.getMonth()] + " " + d.getFullYear();
}

function initForm() {
  const form = document.getElementById("formPengajuan");
  if (!form) return;
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get("edit");
  let editMode = false;

  if (editId) {
    const data = getData();
    const itemToEdit = data.find(function (item) {
      return item.id == editId;
    });
    if (itemToEdit) {
      editMode = true;
      document.getElementById("nama").value = itemToEdit.nama || "";
      document.getElementById("nim").value = itemToEdit.nim || "";
      const prodiEl = document.getElementById("prodi");
      if (prodiEl && itemToEdit.prodi) prodiEl.value = itemToEdit.prodi;
      const layananEl = document.getElementById("layanan");
      if (layananEl && itemToEdit.layanan) layananEl.value = itemToEdit.layanan;
      document.getElementById("tanggal").value = itemToEdit.tanggal || "";
      document.getElementById("keterangan").value = itemToEdit.keterangan || "";

      const btnSubmit = form.querySelector('button[type="submit"]');
      if (btnSubmit) btnSubmit.innerHTML = "Simpan Perubahan";
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let data = getData();
    

    const nama = document.getElementById("nama").value.trim();
    const nim = document.getElementById("nim").value.trim();
    const prodi = document.getElementById("prodi").value;
    const layanan = document.getElementById("layanan").value;
    const tanggal = document.getElementById("tanggal").value;
    const keterangan = document.getElementById("keterangan").value.trim();
    const errorEl = document.getElementById("formError");

    errorEl.textContent = "";

    if (!nama || !nim || !prodi || !layanan || !tanggal) {
      errorEl.textContent = "semua isian wajib harus dilengkapi";
      return;
    }

    if (nim.length !== 8 || isNaN(nim)) {
      errorEl.textContent = "NIM harus berisi 8 digit angka!";
      return;
    }

    if (editMode) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id == editId) {
          data[i].nama = nama;
          data[i].nim = nim;
          data[i].prodi = prodi;
          data[i].layanan = layanan;
          data[i].tanggal = tanggal;
          data[i].keterangan = keterangan;
          break;
        }
      }
    } else {
      const item = {
        id: Date.now(),
        nama: nama,
        nim: nim,
        prodi: prodi,
        layanan: layanan,
        tanggal: tanggal,
        keterangan: keterangan,
      };
      data.push(item);
    }
    saveData(data);

    form.reset();
    errorEl.textContent = "";
    alert(
      editMode ? "Perubahan berhasil disimpan" : "pengajuan berhasil disimpan!",
    );
    window.location.href = "riwayat.html";
  });
}

function initRiwayat() {
  const tbody = document.getElementById('tableBody');
  const emptyState = document.getElementById('emptyState');
  const dataCount = document.getElementById('dataCount');
  const btnHapusSemua = document.getElementById('btnHapusSemua');
  if (!tbody) return; 

  renderTable(); 
  if (btnHapusSemua) {
    btnHapusSemua.addEventListener('click', function () {

    if (confirm('Apakah Anda yakin ingin menghapus sistem seluruh riwayat data?')) {
      saveData([]); 
      renderTable(); // Refresh tabel
    }
  });
}
  function renderTable() {

    const data = getData();

    if (dataCount) {
      dataCount.textContent = data.length + ' pengajuan';
    }


    if (data.length === 0) {
      tbody.innerHTML = ''; 
      if (emptyState) emptyState.style.display = 'block';
      if (btnHapusSemua) btnHapusSemua.style.display = 'none';
      return; // hentikan langkah dan keluar
    }
    if (emptyState) emptyState.style.display = 'none';
    if (btnHapusSemua) btnHapusSemua.style.display = 'inline-block';

    tbody.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const tr = document.createElement('tr'); 


      tr.innerHTML =
        '<td>' + (i + 1) + '</td>' +
        '<td>' + item.nama + '</td>' +
        '<td>' + item.nim + '</td>' +
        '<td>' + item.layanan + '</td>' +
        '<td>' + formatTanggal(item.tanggal) + '</td>' +
        '<td>' +
        '<button class="btn-edit" data-id="' + item.id + '">✏️Edit</button> ' +
        '<button class="btn-hapus" data-id="' + item.id + '">🗑Hapus</button>' +
        '</td>';
      tbody.appendChild(tr);
    }

    const btnEdit = document.querySelectorAll('.btn-edit');
    btnEdit.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = this.getAttribute('data-id'); 
        window.location.href = 'layanan.html?edit=' + id; 
      });
    });
// Event listener Update tombol HAPUS di per baris
    const btnHapus = document.querySelectorAll('.btn-hapus');
    btnHapus.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = Number(this.getAttribute('data-id'));
        if (confirm('Hapus pengajuan riwayat ini selamalamanya?')) {
          let data = getData();

          data = data.filter(function (item) {
            return item.id !== id;

          });
          saveData(data);
          renderTable();
        }
      });
    });
  }  
}

document.addEventListener('DOMContentLoaded', function() {
  initForm();
  initRiwayat();
});
  

