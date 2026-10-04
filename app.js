// Simple Task Manager web app (no backend). Data is kept in memory.
const VALID_USER = { username: 'demo', password: 'demo123' };
let tasks = [];

const $ = (id) => document.getElementById(id);

function showLogin() {
  $('dashboard-page').hidden = true;
  $('login-page').hidden = false;
  $('login-form').reset();
}

function showDashboard(username) {
  $('login-page').hidden = true;
  $('dashboard-page').hidden = false;
  $('welcome-message').textContent = `Welcome, ${username}!`;
  renderTasks();
}

// ---- Login ----
$('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = $('username').value.trim();
  const password = $('password').value;
  const error = $('login-error');

  if (!username && !password) {
    error.textContent = 'Username and password are required';
  } else if (!username) {
    error.textContent = 'Username is required';
  } else if (!password) {
    error.textContent = 'Password is required';
  } else if (username !== VALID_USER.username || password !== VALID_USER.password) {
    error.textContent = 'Invalid username or password';
  } else {
    error.textContent = '';
    showDashboard(username);
  }
});

// ---- Logout ----
$('logout-button').addEventListener('click', () => {
  tasks = [];
  $('task-error').textContent = '';
  showLogin();
});

// ---- Add task ----
$('task-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = $('task-input').value;
  const error = $('task-error');

  if (title === '') {
    error.textContent = 'Task cannot be empty';
    return;
  }
  if (tasks.some((t) => t.title.toLowerCase() === title.trim().toLowerCase())) {
    error.textContent = 'This task already exists';
    return;
  }
  error.textContent = '';
  tasks.push({ id: Date.now(), title: title.trim(), done: false });
  $('task-input').value = '';
  renderTasks();
});

// ---- Show tasks ----
function renderTasks() {
  const list = $('task-list');
  list.innerHTML = '';
  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = task.done ? 'done' : '';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.setAttribute('aria-label', `Complete ${task.title}`);
    checkbox.addEventListener('change', () => {
      task.done = checkbox.checked;
      renderTasks();
    });

    const text = document.createElement('span');
    text.textContent = task.title;

    const del = document.createElement('button');
    del.className = 'delete';
    del.textContent = 'Delete';
    del.setAttribute('aria-label', `Delete ${task.title}`);
    del.addEventListener('click', () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      renderTasks();
    });

    li.append(checkbox, text, del);
    list.appendChild(li);
  });

  const completed = tasks.filter((t) => t.done).length;
  $('task-counter').textContent = `${tasks.length} tasks, ${completed} completed`;
  $('empty-message').hidden = tasks.length > 0;
}
