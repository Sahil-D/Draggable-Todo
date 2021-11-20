const todos = document.querySelectorAll('.todo');
const statuses = document.querySelectorAll('.status');
let draggableTodo = null;

var localTodosList = JSON.parse(localStorage.getItem('todos')) || [];

localTodosList.forEach((todo) => {
  createTodo(todo.content, todo.status);
});

function saveTodoListToLocalStorage(todoList) {
  localStorage.setItem('todos', JSON.stringify(todoList));
}

// Drag event listeners

todos.forEach((todo) => {
  todo.addEventListener('dragstart', dragStart);
  todo.addEventListener('dragend', dragEnd);
});

statuses.forEach((status) => {
  status.addEventListener('dragover', dragOver);
  status.addEventListener('dragenter', dragEnter);
  status.addEventListener('dragleave', dragLeave);
  status.addEventListener('drop', dragDrop);
});

function dragStart() {
  // to not show from where it started dragging
  draggableTodo = this;
  setTimeout(() => {
    this.style.display = 'none';
  }, 0);
}

function dragEnd() {
  draggableTodo = null;
  setTimeout(() => {
    this.style.display = 'flex';
  }, 0);
}

function dragOver(e) {
  // its default behaviour doesn't allow to drop the draggable
  e.preventDefault();
}

function dragEnter() {
  this.style.border = '1px dashed #ccc';
  this.style.borderTop = 'none';
}

function dragLeave() {
  this.style.border = 'none';
}

function dragDrop() {
  // console.log('drop');
  // console.log(this.id);
  this.appendChild(draggableTodo);
  this.style.border = 'none';

  localTodosList = localTodosList.map((todo) => {
    if (todo.content === draggableTodo.firstChild.innerHTML) {
      todo = { ...todo, status: this.id };
    }
    return todo;
  });

  saveTodoListToLocalStorage(localTodosList);
}

// < ------------------------------------------------------------------------------>
// Modal Part

const btns = document.querySelectorAll('[data-target-modal]');
const close_modals = document.querySelectorAll('.close-modal');
const overlay = document.getElementById('overlay');

btns.forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelector(btn.dataset.targetModal).classList.add('active');
    overlay.classList.add('active');
  });
});

close_modals.forEach((btn) => {
  btn.addEventListener('click', () => {
    const modal = btn.closest('.modal');
    modal.classList.remove('active');
    overlay.classList.remove('active');
  });
});

window.onclick = (event) => {
  if (event.target == overlay) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) => modal.classList.remove('active'));
    overlay.classList.remove('active');
  }
};

// < ------------------------------------------------------------------------------>
// Todo Creation

const todoSubmit = document.getElementById('todo-submit');
todoSubmit.addEventListener('click', addNewTodo);

function addNewTodo() {
  const todoValue = document.getElementById('todo-input');
  if (todoValue.value == '') return;

  if (todoAlreadyExist(todoValue.value)) {
    alert('Todo already exists');
    return;
  }

  createTodo(todoValue.value, 'no-status');

  const new_id = localTodosList.length
    ? localTodosList[localTodosList.length - 1].id + 1
    : 0;

  const newTodo = {
    id: new_id,
    content: todoValue.value,
    status: 'no-status',
  };
  localTodosList.push(newTodo);
  saveTodoListToLocalStorage(localTodosList);
  todoValue.value = '';
}

function todoAlreadyExist(newTodoContent) {
  const oldTodo = localTodosList.find(
    (todo) => todo.content === newTodoContent
  );
  return oldTodo ? true : false;
}

function createTodo(content, todo_status) {
  const todoDiv = document.createElement('div');
  const todoDivContent = document.createElement('div');
  const todoDivRemove = document.createElement('div');

  const txt = document.createTextNode(content);

  todoDivContent.appendChild(txt);
  todoDivContent.classList.add('todo-content');

  const remove_txt = document.createTextNode('\u00D7');
  todoDivRemove.appendChild(remove_txt);
  todoDivRemove.classList.add('todo-remove');

  todoDivRemove.addEventListener('click', () => {
    removeTodo(todoDivRemove);
  });

  todoDiv.appendChild(todoDivContent);
  todoDiv.appendChild(todoDivRemove);
  todoDiv.classList.add('todo');
  todoDiv.setAttribute('draggable', 'true');

  todoDiv.addEventListener('dragstart', dragStart);
  todoDiv.addEventListener('dragend', dragEnd);

  todoStatusTag = document.getElementById(todo_status);
  todoStatusTag.appendChild(todoDiv);

  document.getElementById('todo-form').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
}

// these newly created todos will give error on drag as they are dynamically created
// we can use Event Bubbling here
// but for simplicity here we are adding event listeners to each

const removeButtons = document.querySelectorAll('.todo-remove');

removeButtons.forEach((removeBtn) => {
  removeBtn.addEventListener('click', () => {
    removeTodo(removeBtn);
  });
});

function removeTodo(removeBtn) {
  removeBtn.parentElement.style.display = 'none';

  const removedTodoContent = removeBtn.parentElement.firstChild.innerHTML;

  localTodosList = localTodosList.filter(
    (todo) => todo.content !== removedTodoContent
  );
  saveTodoListToLocalStorage(localTodosList);
}
