document.addEventListener("DOMContentLoaded", () => {
  // --- Local Storage Anahtarları ---
  const TODOS_STORAGE_KEY = "4rt_todos_list";
  const THEME_STORAGE_KEY = "4rt_theme_preference";
  const USERNAME_STORAGE_KEY = "4rt_username";

  // --- Element Seçimleri ---
  const themeToggle = document.querySelector("#theme-toggle");
  const moonIcon = document.querySelector("#moon-icon");
  const sunIcon = document.querySelector("#sun-icon");
  const htmlElement = document.documentElement;
  const nameDOM = document.querySelector("#name");
  const dateDOM = document.querySelector("#current-time");
  const taskInput = document.querySelector("#yapilacak");
  const addButton = document.querySelector("#eklemeButonu");
  const taskList = document.querySelector("#yapilacaklar");

  // =========================================
  // TEMA İŞLEVSELLİĞİ (LOCAL STORAGE İLE)
  // =========================================
  const saveTheme = () => {
    const isLightMode = htmlElement.classList.contains("light-mode");
    localStorage.setItem(THEME_STORAGE_KEY, isLightMode ? "light" : "dark");
  };

  const loadTheme = () => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    // Varsayılan tema koyu olduğu için sadece açık modu kontrol ediyoruz.
    if (savedTheme === "light") {
      htmlElement.classList.add("light-mode");
    }
    // Sayfa yüklendiğinde doğru ikonun görünmesini sağla
    const isLightMode = htmlElement.classList.contains("light-mode");
    sunIcon.style.display = isLightMode ? "block" : "none";
    moonIcon.style.display = isLightMode ? "none" : "block";
  };

  themeToggle.addEventListener("click", () => {
    htmlElement.classList.toggle("light-mode");
    const isLightMode = htmlElement.classList.contains("light-mode");
    sunIcon.style.display = isLightMode ? "block" : "none";
    moonIcon.style.display = isLightMode ? "none" : "block";
    saveTheme(); // Her değişiklikte temayı kaydet
  });

  // =========================================
  // KULLANICI ADI İŞLEVSELLİĞİ (LOCAL STORAGE İLE)
  // =========================================
  const loadUser = () => {
    let username = localStorage.getItem(USERNAME_STORAGE_KEY);
    if (!username || username.trim() === "") {
      username = prompt("Merhaba! Lütfen adınızı girin:");
      if (username && username.trim() !== "") {
        localStorage.setItem(USERNAME_STORAGE_KEY, username);
      } else {
        username = "Ziyaretçi"; // Kullanıcı isim girmezse varsayılan değer
      }
    }
    nameDOM.textContent = username;
  };

  // =========================================
  // SAAT İŞLEVSELLİĞİ
  // =========================================
  const updateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    dateDOM.textContent = `${date}.${month}.${year}\n${hours}:${minutes}:${seconds}`;
  };

  // =========================================
  // YAPILACAKLAR LİSTESİ (LOCAL STORAGE İLE)
  // =========================================
  const saveTodos = () => {
    const todos = [];
    taskList.querySelectorAll("li").forEach((listItem) => {
      const taskText = listItem.querySelector(".task-text").textContent;
      const isCompleted = listItem.classList.contains("completed");
      todos.push({ text: taskText, completed: isCompleted });
    });
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  };

  const createTodoElement = (task) => {
    const listItem = document.createElement("li");
    if (task.completed) {
      listItem.classList.add("completed");
    }
    // Mevcut HTML yapınızı ve sınıflarınızı koruyoruz
    listItem.innerHTML = `<span class="task-text">${task.text}</span><span class="delete-btn">×</span>`;
    taskList.appendChild(listItem);
  };

  const loadTodos = () => {
    const storedTodos = localStorage.getItem(TODOS_STORAGE_KEY);
    if (storedTodos) {
      const todos = JSON.parse(storedTodos);
      todos.forEach((task) => createTodoElement(task));
    }
  };

  const addTask = () => {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const newTask = { text: taskText, completed: false };
    createTodoElement(newTask);
    saveTodos(); // Listeye ekleme yapınca kaydet

    taskInput.value = "";
    taskInput.focus();
  };

  // Olay dinleyicileri
  addButton.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") addTask();
  });

  taskList.addEventListener("click", (event) => {
    const clickedElement = event.target;
    const listItem = clickedElement.closest("li");

    if (!listItem) return;

    // Silme butonuna tıklandıysa
    if (clickedElement.classList.contains("delete-btn")) {
      // Animasyonu koruyoruz
      listItem.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      listItem.style.opacity = "0";
      listItem.style.transform = "translateX(20px)";
      setTimeout(() => {
        listItem.remove();
        saveTodos(); // Animasyon bittikten sonra kaydet
      }, 300);
    }
    // Liste elemanının kendisine tıklandıysa (tamamlama)
    else {
      listItem.classList.toggle("completed");
      saveTodos(); // Durumu değiştirince kaydet
    }
  });

  // =========================================
  // SAYFA YÜKLENDİĞİNDE ÇALIŞACAK FONKSİYONLAR
  // =========================================
  loadTheme();
  loadUser();
  updateTime();
  setInterval(updateTime, 1000);
  loadTodos();
});
