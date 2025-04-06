document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');
  const taskCount = document.getElementById('taskCount');

  // Fetch all tasks
  async function fetchTasks() {
    try {
      const response = await fetch('/api/tasks');
      const tasks = await response.json();
      renderTasks(tasks);
      updateTaskCount(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  // Render tasks to the DOM
  function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.className = `task-item flex items-center justify-between p-3 border rounded-lg ${task.completed ? 'bg-gray-50' : 'bg-white'}`;
      taskElement.innerHTML = `
        <div class="flex items-center">
          <input 
            type="checkbox" 
            ${task.completed ? 'checked' : ''}
            data-id="${task.id}"
            class="task-checkbox h-5 w-5 text-blue-500 rounded focus:ring-blue-400"
          >
          <span class="ml-3 ${task.completed ? 'completed-task' : ''}">${task.title}</span>
        </div>
        <div class="task-actions opacity-0">
          <button 
            data-id="${task.id}"
            class="delete-btn text-red-500 hover:text-red-700"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      taskList.appendChild(taskElement);
    });

    // Add event listeners to checkboxes and delete buttons
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', toggleTaskStatus);
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', deleteTask);
    });
  }

  // Update task count display
  function updateTaskCount(tasks) {
    const completedCount = tasks.filter(task => task.completed).length;
    taskCount.textContent = `${completedCount} of ${tasks.length} tasks completed`;
  }

  // Add new task
  async function addTask() {
    const title = taskInput.value.trim();
    if (!title) return;

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });
      const newTask = await response.json();
      taskInput.value = '';
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }

  // Toggle task completion status
  async function toggleTaskStatus(e) {
    const taskId = e.target.dataset.id;
    const completed = e.target.checked;

    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  // Delete task
  async function deleteTask(e) {
    const taskId = e.target.closest('button').dataset.id;

    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  // Event listeners
  addTaskBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  // Initial load
  fetchTasks();
});