const form = document.querySelector("#addTodoForm"); 
const todolar = document.querySelector("#todolar");
const clearAllTodosBtn = document.querySelector("#todo-temizle");
const filterInput = document.querySelector("#todo-arama");
const listGroup = todolar.querySelector(".list-group");
let todos = [];

runEvents();

function runEvents () {
  form.addEventListener("submit", addTodoToUI);
  todolar.addEventListener("click", deleteTodoFromUI);
  clearAllTodosBtn.addEventListener("click", deleteAllToDoFromUI);
  filterInput.addEventListener("keyup", filter);
  document.addEventListener("DOMContentLoaded", pageLoaded);
}

function pageLoaded () {
  checkFromStorage();
  writeFromStorage();
}

function addTodoToUI (e) {
  const newTodo = document.createElement("li");
  const userInput = document.querySelector("#todo-ekle-input").value.trim();
  const input = document.querySelector("#todo-ekle-input");
  const todolarDiv = document.querySelector("#todolar");
  const listGroup = todolarDiv.querySelector(".list-group");
  if (userInput !== "") {
    newTodo.className = "list-group-item"
    newTodo.innerHTML = `${userInput}<button class="close-btn close-btn-js">✘</button>`
    listGroup.appendChild(newTodo);
    input.value = "";
    addTodoToStorage(userInput);
    showAlert("positive");
  } else {
    showAlert("negative");
  }
  e.preventDefault();
}

function showAlert (inputCase) {
  const existingAlert = document.querySelector("#warningMessage-div p");
  const alert = document.createElement("p");
  const alertDiv = document.querySelector("#warningMessage-div");
  
  if (existingAlert) {
    return;
  }

  switch (inputCase) {
    case "positive": {
      alert.className = "warningText-success"
      alert.textContent = "Todo ekleme işlemi başarılı!"
      break;
    }
    case "negative": {
      alert.className = "warningText-danger"
      alert.textContent = "Todo ekleme işlemi başarısız!"
      break;
    }
    case "cleared": {
      alert.className = "warningText-cleared"
      alert.textContent = "Bütün Todo'lar temizlendi!"
      break;
    }
    case "unclear": {
      alert.className = "warningText-unclear"
      alert.textContent = "Temizlenecek hiçbir Todo yok!"
      break;
    }
    case "unfiltered": {
      alert.className = "warningText-danger"
      alert.textContent = "Filtrelenecek Todo bulunamadı!"
      break;
    }
  }
  alertDiv.appendChild(alert)
  setTimeout(deleteAlert, 1250);
}

function deleteAlert () {
  const alertDiv = document.querySelector("#warningMessage-div");
  const alert = alertDiv.childNodes[1];
  alert.remove();
}

function deleteAllToDoFromUI (e) {
  const todolar = document.querySelector("#todolar");
  const allTodos = todolar.querySelectorAll(".todo");
  if (allTodos.length !== 0) {
    for (i=0;i<allTodos.length;i++) {
      allTodos[i].remove();
    }
    deleteAllTodosFromStorage();
    showAlert("cleared");
  } else {
    showAlert("unclear");
  }
}

function addTodoToStorage (newTodo) {
  checkFromStorage();
  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function checkFromStorage () {
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
}

function writeFromStorage () {
  const listGroup = todolar.querySelector(".list-group");
  checkFromStorage();
  todos.forEach(function (todo) {
    const newTodo = document.createElement("li");
    newTodo.className = "list-group-item"
    newTodo.innerHTML = `${todo}<button class="close-btn close-btn-js">✘</button>`
    listGroup.appendChild(newTodo);
  });
}

function deleteAllTodosFromStorage () {
  checkFromStorage();
  localStorage.removeItem("todos");
}

function deleteOneTodoFromStorage (removeTodo) {
  checkFromStorage();
  const todoText = removeTodo.childNodes[0].textContent;
  
  todos.forEach(function(todo, index){
    if (todoText === todo) {
      todos.splice(index,1);
    }
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

function deleteTodoFromUI (e) {
  const selectedBtn = e.target;
  const parentTodo = selectedBtn.parentElement;

  if (e.target.className === "close-btn close-btn-js") {
    parentTodo.remove();
  }
  deleteOneTodoFromStorage(parentTodo);
}

function filter (e) {
  // writeFromStorage();
  const listem = document.querySelectorAll(".list-group-item");
  const filterValue = e.target.value.toLowerCase().trim();

  if (listem.length > 0) {
    listem.forEach(function(todo){
      if (todo.textContent.toLowerCase().trim().includes(filterValue)) {
        todo.setAttribute("style", "display : block");
      } else {
        todo.setAttribute("style", "display : none");
      }
    });
  } else {
    showAlert("unfiltered");
  }
}