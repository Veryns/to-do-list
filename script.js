const taskList = document.getElementById('taskList');

document.addEventListener('DOMContentLoaded', getTasks);

function getFormattedDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function setToday() { document.getElementById('dateInput').value = getFormattedDate(new Date()); }
function setTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('dateInput').value = getFormattedDate(tomorrow);
}

function getDateLabel(dateString) {
    if (!dateString) return 'Tanpa pengingat';
    const todayStr = getFormattedDate(new Date());
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = getFormattedDate(tomorrow);

    if (dateString === todayStr) return 'Hari Ini';
    if (dateString === tomorrowStr) return 'Besok';
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    if (taskInput.value.trim() === '') return;

    createTaskElement(taskInput.value, dateInput.value, false);
    saveLocalTasks();
    taskInput.value = '';
}

function createTaskElement(text, date, isCompleted) {
    const li = document.createElement('li');
    li.className = `todo-item`;
    li.draggable = true;
    li.dataset.date = date;

    li.innerHTML = `
        <input type="checkbox" class="checkbox" ${isCompleted ? 'checked' : ''} onchange="toggleComplete(this)">
        <div class="task-info">
            <strong>${text}</strong>
            <span>📅 ${getDateLabel(date)}</span>
        </div>
        <button class="delete-btn" onclick="removeTask(this)">Hapus</button>
    `;

    li.addEventListener('dragstart', () => li.classList.add('dragging'));
    li.addEventListener('dragend', () => { li.classList.remove('dragging'); saveLocalTasks(); });
    taskList.appendChild(li);
}

function toggleComplete(checkbox) {
    saveLocalTasks();
}

function removeTask(btn) {
    btn.parentElement.remove();
    saveLocalTasks();
}

function saveLocalTasks() {
    const tasks = [];
    document.querySelectorAll('.todo-item').forEach(item => {
        tasks.push({
            text: item.querySelector('strong').innerText,
            date: item.dataset.date,
            completed: item.querySelector('.checkbox').checked
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    taskList.innerHTML = '';
    tasks.forEach(task => createTaskElement(task.text, task.date, task.completed));
}

function deleteTasksByDate() {
    const selectedDate = document.getElementById('dateInput').value;
    if (!selectedDate) {
        alert("Pilih tanggal terlebih dahulu!");
        return;
    }
    if (confirm(`Hapus semua tugas tanggal ${getDateLabel(selectedDate)}?`)) {
        document.querySelectorAll('.todo-item').forEach(item => {
            if (item.dataset.date === selectedDate) item.remove();
        });
        saveLocalTasks();
    }
}