// 获取DOM元素
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodo');
const todoList = document.getElementById('todoList');
const todoCount = document.getElementById('todoCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');

// 初始化待办事项数组
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// 保存待办事项到本地存储
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 更新待办事项计数
function updateTodoCount() {
    const activeCount = todos.filter(todo => !todo.completed).length;
    todoCount.textContent = `${activeCount} 个待办事项`;
}

// 创建待办事项元素
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
        <span class="todo-text">${todo.text}</span>
        <button class="delete-btn">删除</button>
    `;

    // 复选框事件处理
    const checkbox = li.querySelector('.todo-checkbox');
    checkbox.addEventListener('change', () => {
        todo.completed = checkbox.checked;
        li.classList.toggle('completed', todo.completed);
        saveTodos();
        updateTodoCount();
    });

    // 删除按钮事件处理
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        todos = todos.filter(t => t !== todo);
        li.remove();
        saveTodos();
        updateTodoCount();
    });

    return li;
}

// 渲染待办事项列表
function renderTodos(filter = 'all') {
    todoList.innerHTML = '';
    todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    }).forEach(todo => {
        todoList.appendChild(createTodoElement(todo));
    });
}

// 添加新待办事项
function addTodo(text) {
    if (text.trim()) {
        const todo = {
            id: Date.now(),
            text: text.trim(),
            completed: false
        };
        todos.push(todo);
        todoList.appendChild(createTodoElement(todo));
        saveTodos();
        updateTodoCount();
        todoInput.value = '';
    }
}

// 事件监听器
addTodoBtn.addEventListener('click', () => addTodo(todoInput.value));

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo(todoInput.value);
    }
});

clearCompletedBtn.addEventListener('click', () => {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
    updateTodoCount();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTodos(btn.dataset.filter);
    });
});

// 初始化应用
renderTodos();
updateTodoCount(); 