// Gerekli elementleri seçiyoruz.
// HTML'deki doğru ID'yi kullandığımıza emin olalım: #theme-toggle
const themeToggle = document.querySelector("#theme-toggle");
const moonIcon = document.querySelector("#moon-icon");
const sunIcon = document.querySelector("#sun-icon");
const htmlElement = document.documentElement; // <html> elementini seçer

// Butonun var olup olmadığını kontrol edip click olayını ekliyoruz.
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    // <html> elementinde 'light-mode' sınıfı var mı diye kontrol edip,
    // yoksa ekliyor, varsa kaldırıyor.
    htmlElement.classList.toggle("light-mode");

    // 'light-mode' sınıfının varlığına göre ikonları gösterip/gizliyoruz.
    const isLightMode = htmlElement.classList.contains("light-mode");

    // Açık mod aktifse güneş ikonunu, değilse ay ikonunu göster.
    sunIcon.style.display = isLightMode ? "block" : "none";
    moonIcon.style.display = isLightMode ? "none" : "block";

    console.log(
      "Tema değiştirildi. Mevcut mod:",
      isLightMode ? "Açık" : "Koyu"
    );
  });
}

// Kullanıcıdan ismini alıp ekrana yazdıralım.
const nameDOM = document.querySelector("#name");

// prompt() fonksiyonunu parantezlerle çağırarak kullanıcıya bir soru soruyoruz.
const username = prompt("Merhaba! Lütfen adınızı girin:");

// Kullanıcı bir isim girdiyse (null değilse VE boşluklardan arındırılmış hali boş değilse)
if (username && username.trim() !== "") {
  nameDOM.textContent = username;
} else {
  // Eğer kullanıcı isim girmezse veya iptal ederse, varsayılan "Ziyaretçi" metnini kullan.
  nameDOM.textContent = "Ziyaretçi";
}

const dateDOM = document.querySelector("#current-time");

function updateTime() {
  const now = new Date(); // Mevcut tarih ve saat objesi
  const year = now.getFullYear(); // Yıl bilgisini al (4 haneli)
  const month = String(now.getMonth() + 1).padStart(2, "0"); // ay bilgisini al ve iki haneli yap
  const date = String(now.getDate()).padStart(2, "0"); // gün bilgisini al ve iki haneli yap
  const hours = String(now.getHours()).padStart(2, "0"); // saat bilgisini al ve iki haneli yap
  const minutes = String(now.getMinutes()).padStart(2, "0"); // dakika bilgisini al ve iki haneli yap
  const seconds = String(now.getSeconds()).padStart(2, "0"); // saniye bilgisini al ve iki haneli yap
  dateDOM.textContent = `${date}.${month}.${year}\n${hours}:${minutes}:${seconds}`;
}

updateTime(); // sayfa yüklendiğinde saati hemen göster
setInterval(updateTime, 1000); // her 1 saniyede bir saati güncelle

/*
 * =========================================
 * Yapılacaklar Listesi İşlevselliği
 * =========================================
 */

const taskInput = document.querySelector("#yapilacak");
const addButton = document.querySelector("#eklemeButonu");
const taskList = document.querySelector("#yapilacaklar");

function addTask() {
  const taskText = taskInput.value.trim(); // Yazılan metni al ve boşlukları temizle

  if (taskText === "") {
    alert("Lütfen bir görev girin.");
    return; // Fonksiyonu durdur
  }

  const listItem = document.createElement("li"); // Yeni bir <li> elementi oluştur
  // Görev metnini ve silme butonunu içeren HTML'i ayarla
  listItem.innerHTML = `<span class="task-text">${taskText}</span><span class="delete-btn">×</span>`;
  taskList.appendChild(listItem); // <li>'yi <ul> listesine ekle

  taskInput.value = ""; // Ekleme sonrası input alanını temizle
  taskInput.focus(); // İmleci tekrar input alanına odakla
}

// "Ekle" butonuna tıklandığında veya Enter'a basıldığında görev ekle
addButton.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

// Görevleri tamamlama ve silme için olay dinleyicisi (event delegation)
taskList.addEventListener("click", function (event) {
  const clickedElement = event.target;

  // Silme butonuna tıklandıysa
  if (clickedElement.classList.contains("delete-btn")) {
    const listItem = clickedElement.parentElement;
    // Animasyonlu silme
    listItem.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    listItem.style.opacity = "0";
    listItem.style.transform = "translateX(20px)";
    setTimeout(() => listItem.remove(), 300);
  }
  // Liste elemanının kendisine veya içindeki metne tıklandıysa
  else if (clickedElement.closest("li")) {
    clickedElement.closest("li").classList.toggle("completed");
  }
});
