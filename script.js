const todos = document.querySelectorAll('.todo');
const statuses = document.querySelectorAll('.status');
let draggableTodo = null;

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
  this.appendChild(draggableTodo);
  this.style.border = 'none';
  console.log('drop');
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

todoSubmit.addEventListener('click', createTodo);

function createTodo() {
  console.log('click');
  const todoDiv = document.createElement('div');
  const todoDivContent = document.createElement('div');
  const todoDivRemove = document.createElement('div');

  const todoValue = document.getElementById('todo-input');
  if (todoValue.value == '') return;
  const txt = document.createTextNode(todoValue.value);
  todoValue.value = '';
  todoDivContent.appendChild(txt);
  todoDivContent.classList.add('todo-content');

  const remove_txt = document.createTextNode('\u00D7');
  todoDivRemove.appendChild(remove_txt);
  todoDivRemove.classList.add('todo-remove');

  todoDivRemove.addEventListener('click', () => {
    todoDivRemove.parentElement.style.display = 'none';
  });

  todoDiv.appendChild(todoDivContent);
  todoDiv.appendChild(todoDivRemove);
  todoDiv.classList.add('todo');
  todoDiv.setAttribute('draggable', 'true');

  todoDiv.addEventListener('dragstart', dragStart);
  todoDiv.addEventListener('dragend', dragEnd);

  noStatusTodos = document.getElementById('no-status');
  noStatusTodos.appendChild(todoDiv);

  document.getElementById('todo-form').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
}

// these newly created todos will give error on drag as they are dynamically created
// we can use Event Bubbling here
// but for simplicity here we are adding event listeners to each

const removeButtons = document.querySelectorAll('.todo-remove');

removeButtons.forEach((removeBtn) => {
  removeBtn.addEventListener('click', () => {
    removeBtn.parentElement.style.display = 'none';
  });
});
