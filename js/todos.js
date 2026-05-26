let todos = [];
let currentFilter = 'all';

function addTodo(todo) {
    const newTodo = {
        id: crypto.randomUUID(),
        text: todo,
        completed: false
    }
    todos.push(newTodo);
    renderTodos();
    updateCount();
    saveTodosToStorage();
}

function deleteTodo(id) {
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) return;
    todos.splice(index, 1);
    renderTodos();
    updateCount();
    saveTodosToStorage();
}

function toggleTodo(id) {
    const todo = todos.find(todo => todo.id === id);
    if (!todo) return;
    todo.completed = !todo.completed;
    renderTodos();
    updateCount();
    saveTodosToStorage();
}

function todosCount() {
    let count = 0;
    for (let item of todos) {
        if (!item.completed) {
            count++;
        }
    }
    return count;
}

function updateCount() {
    const countTextEl = document.getElementById('todo-count');
    const count = todosCount();

    const countText = count > 1 
        ? `${count} items left` 
        : `${count} item left`;

    countTextEl.innerText = countText;
}

function saveTodosToStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    const todoList = document.getElementById('todo-list');
    let html = "";

    let filteredTodos = todos;

    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    }

    else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    filteredTodos.forEach(todo => {
        html += `<div class="todo-item ${todo.completed ? 'todo-completed' : ''}" data-id="${todo.id}" draggable="true">
            <label class="todo-left">
                <span class="todo-check">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''}/>
                    <span class="checkmark todo-checkmark"></span>
                </span>
                <p class="todo-text">${todo.text}</p>
            </label>
            <img src="/images/icon-cross.svg" class="todo-delete"/>
        </div>`;
    });

    todoList.innerHTML = html;
}

export function initTodos() {
    const todoForm = document.getElementById('todo-form')
    const todoList = document.getElementById('todo-list');

    //load saved todos
    const storedTodos = localStorage.getItem('todos');
    todos = storedTodos ? JSON.parse(storedTodos) : [];
    renderTodos();
    updateCount();

    // add todo
    todoForm.addEventListener('submit', (e) => {
        const errorModal = document.getElementById('error-modal')
        const todoInput = document.getElementById('todo-input');
        const todo = todoInput.value.trim();
        

        e.preventDefault();

        if (todo === '') {
            errorModal.classList.remove('hidden');
            return;
        }
        
        addTodo(todo);

        todoInput.value = "";
        todoInput.focus();
    });

    // hide error modal
    const errorModal = document.getElementById('error-modal');

    errorModal.addEventListener('click', () => {
        errorModal.classList.add('hidden');
    });

    // delete and toggle todo
    todoList.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.todo-delete');

        if (deleteBtn) {
            const todoItem = deleteBtn.closest('.todo-item');
            const id = todoItem.dataset.id;
            deleteTodo(id);
            return;
        }

        const todoItem = e.target.closest('.todo-item');
        if (todoItem) {
            const id = todoItem.dataset.id;
            toggleTodo(id);
        }
    });

    // filter todo
    const filterButtons = document.querySelectorAll('[data-filter]');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            
            filterButtons.forEach(b => b.classList.remove('active-filter'));
            btn.classList.add('active-filter');

            renderTodos();
        });
    });

    // clear completed todos
    const clearBtn = document.getElementById('todo-clear');
    clearBtn.addEventListener('click', () => {
        todos = todos.filter(todo => !todo.completed)
        renderTodos();
        updateCount();
        saveTodosToStorage();
    });

    // drag and drop todo
    let draggedId = null;

    todoList.addEventListener('dragstart', (e) => {
        const item = e.target.closest('.todo-item');

        if (!item) return;

        draggedId = item.dataset.id;

    });

    todoList.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    todoList.addEventListener('drop', (e) => {
        const targetItem = e.target.closest('.todo-item');
        if (!targetItem) return;

        const targetId = targetItem.dataset.id;

        if (draggedId === targetId) return;

        const draggedIndex = todos.findIndex(t => t.id === draggedId);
        const targetIndex = todos.findIndex(t => t.id === targetId);

        const [movedItem] = todos.splice(draggedIndex, 1);
        todos.splice(targetIndex, 0, movedItem);

        renderTodos();
        saveTodosToStorage();
    });

    updateCount();
}
