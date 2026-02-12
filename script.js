let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""} 
        onchange="toggleDone(${index})">
      ${task.title} (${task.dueDate})
      <button onclick="editTask(${index})">編集</button>
      <button onclick="deleteTask(${index})">削除</button>
    `;

    list.appendChild(li);
  });
}

function addTask() {
  const title = document.getElementById("taskInput").value;
  const dueDate = document.getElementById("dueDate").value;

  if (!title) return;

  tasks.push({ title, dueDate, done: false });
  saveTasks();
  renderTasks();
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newTitle = prompt("新しいタスク名", tasks[index].title);
  if (newTitle) {
    tasks[index].title = newTitle;
    saveTasks();
    renderTasks();
  }

  if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

function checkReminders() {
  const now = new Date();

  tasks.forEach(task => {
    if (!task.done && task.dueDate) {
      const due = new Date(task.dueDate);

      if (due <= now && !task.notified) {
        new Notification("タスク期限です！", {
          body: task.title
        });
        task.notified = true;
        saveTasks();
      }
    }
  });
}

setInterval(checkReminders, 60000);
}

renderTasks();
