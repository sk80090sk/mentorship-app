let input = document.getElementById("taskInput");
let button = document.getElementById("addBtn");
let list = document.getElementById("taskList");
let progressText = document.getElementById("progress");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// fix old data
tasks = tasks.map(t => {
  if (typeof t === "string") {
    return { id: Date.now(), text: t, completed: false };
  }
  if (!t.id) t.id = Date.now() + Math.random();
  return t;
});

// load
window.onload = function () {
  tasks.forEach(t => addTaskToUI(t.text, t.completed, t.id));
  updateProgress();
};

// add
function addTask() {
  let text = input.value.trim();
  if (!text) return;

  let task = { id: Date.now(), text, completed: false };
  tasks.push(task);

  save();
  addTaskToUI(task.text, task.completed, task.id);

  input.value = "";
  updateProgress();
}

// UI
function addTaskToUI(text, completed, id) {
  let li = document.createElement("li");

  li.innerHTML = `
    <span class="text">${text}</span>
    <div class="actions">
      <input type="checkbox" class="check">
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    </div>
  `;

  let checkbox = li.querySelector(".check");
  let textSpan = li.querySelector(".text");

  checkbox.checked = completed;

  if (completed) {
    li.classList.add("completed");
    textSpan.style.textDecoration = "line-through";
    textSpan.style.color = "#d1fae5";
  }

  checkbox.addEventListener("change", function (e) {
    e.stopPropagation();

    let task = tasks.find(t => t.id === id);
    if (task) task.completed = checkbox.checked;

    if (checkbox.checked) {
      li.classList.add("completed");
      textSpan.style.textDecoration = "line-through";
    } else {
      li.classList.remove("completed");
      textSpan.style.textDecoration = "none";
    }

    save();
    updateProgress();
  });

  li.addEventListener("click", function (e) {
    if (e.target.closest("button") || e.target.classList.contains("check")) return;
    checkbox.checked = !checkbox.checked;
    checkbox.dispatchEvent(new Event("change"));
  });

  li.querySelector(".delete").addEventListener("click", function (e) {
    e.stopPropagation();
    tasks = tasks.filter(t => t.id !== id);
    save();
    li.remove();
    updateProgress();
  });

  li.querySelector(".edit").addEventListener("click", function (e) {
    e.stopPropagation();
    let newText = prompt("Edit task:", text);
    if (newText && newText.trim()) {
      let task = tasks.find(t => t.id === id);
      if (task) task.text = newText;
      textSpan.innerText = newText;
      save();
    }
  });

  list.prepend(li);
}

// save
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// progress
function updateProgress() {
  let total = tasks.length;
  let completed = tasks.filter(t => t.completed).length;

  progressText.innerText = total === 0 
    ? "No tasks yet"
    : `${completed} / ${total} completed`;

  if (completed === total && total !== 0) {
    progressText.style.background = "#22c55e";
  } else {
    progressText.style.background = "linear-gradient(135deg, #00c6ff, #0072ff)";
  }
}

// events
button.addEventListener("click", addTask);

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") addTask();
});
