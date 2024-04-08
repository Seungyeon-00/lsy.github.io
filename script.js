// �ð� ���
function updateClock() {
    const now = new Date();
    const clock = document.getElementById('clock');
    clock.innerText = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);

// OpenWeatherMap API�� ����� ���� ���
const API_KEY = '136b272f40da133f1150aad4119a2b9c';

function fetchWeather(latitude, longitude) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            return response.json();
        })
        .then(data => {
            const weather = document.querySelector("#weather span:first-child")
            const city = document.querySelector("#weather span:last-child")
            city.innerText = data.name;
            weather.innerText = data.weather[0].main;
        })
    
}

function onGeoOk(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    fetchWeather(latitude, longitude);
}

function onGeoError() {
    alert("Can't find you. No weather for you.")
}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);


// ����ڸ��� ���� ���� ���丮��
const loginForm = document.getElementById('loginForm');
const userSection = document.getElementById('userSection');
const usernameDisplay = document.getElementById('usernameDisplay');
const logoutBtn = document.getElementById('logoutBtn');

// ����ڰ� �̹� �α��εǾ� �ִ��� Ȯ��
const storedUsername = localStorage.getItem('username');
if (storedUsername) {
    loginForm.style.display = 'none'; // �α��� ��� �����
    userSection.style.display = 'block'; // ����� ���� ǥ��
    usernameDisplay.textContent = storedUsername;  // ����ڸ� ǥ��
    //logoutBtn.style.display = 'block'; // �α׾ƿ� ��ư ǥ��
} else {
    logoutBtn.style.display = 'none'; // �α׾ƿ� ��ư�� �α������� �ʾ��� �� �����
}

// �α��� �̺�Ʈ
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();
    localStorage.setItem('username', username); // ���� ���丮���� ����ڸ� ����
    usernameDisplay.textContent = username; // ����ڸ� ǥ��
    loginForm.style.display = 'none';  // �α��� ��� �����
    userSection.style.display = 'block'; // ����� ���� ǥ��
    logoutBtn.style.display = 'block'; // �α׾ƿ� ��ư ǥ��
});

// �α׾ƿ� ��ư Ŭ�� �̺�Ʈ
logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('username'); // ���� ���丮������ ����ڸ� ����
    localStorage.removeItem('list'); // ���� ���丮������ �� �� ��� ����
    location.reload(); // ������ ���� ��ħ -> �α׾ƿ��� ���� �ʱ�ȭ
});

// To Do List 
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');

// ���� ���丮������ To Do List 
document.addEventListener('DOMContentLoaded', function() {
    const storedList = JSON.parse(localStorage.getItem('list')) || [];
    storedList.forEach(item => {
        addTodoItem(item);
    });
});

// ��Ͽ� To Do List �߰�
function addTodoItem(item) {
    const li = document.createElement('li');
    const todoText = document.createElement('span');
    todoText.textContent = item;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'delete';
    deleteBtn.addEventListener('click', function() {
        removeTodoItem(li);
    });
    li.appendChild(todoText);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
}

// ��Ͽ��� To Do List����
function removeTodoItem(item) {
    todoList.removeChild(item); // DOM���� �׸� ����
    saveTodoList(); // todo list ���� ���丮���� ����
}

// todo list �߰�
document.getElementById('addTodoBtn').addEventListener('click', function() {
    const todo = todoInput.value.trim();
    if (todo !== '') {
        addTodoItem(todo);
        todoInput.value = ''; // �� �� �߰� �� �Է� �ʵ� �����
        saveTodoList(); // �� �� ����� ���� ���丮���� ����
    }
});

// todo list ���� ���丮���� ����
function saveTodoList() {
    const todoItems = Array.from(todoList.children).map(li => li.firstChild.textContent);
    localStorage.setItem('list', JSON.stringify(todoItems));
}

// ���� �̹���
function displayRandomImage() {
    const images = ['img1.jpg', 'img2.jpg', 'img3.jpg']; // �̹��� ���� �̸� �迭
    let currentIndex = 0;
    const randomImageDiv = document.getElementById('randomImage');

    // �̹��� ������Ʈ �Լ�
    function updateImage() {
        const imagePath = images[currentIndex]; // �̹��� ��� ���� (�̹����� index.html�� ���� ��ο� �ִ� ���)
        randomImageDiv.innerHTML = `<img src="${imagePath}" alt="Image">`;
    }

    // �̹��� �ʱ�ȭ
    updateImage();

    // Ŭ�� �̺�Ʈ �����ʸ� ����Ͽ� �̹��� ����
    randomImageDiv.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % images.length; // �迭���� ���� �̹����� �̵�
        updateImage();
    });
}
displayRandomImage(); // �ʱ⿡ ȣ��

// �ʱ�ȭ: ����ڰ� �̹� �α��εǾ� �ִ� ��� todo list, ����� ���� ǥ��
if (localStorage.getItem('username')) {
    showTodoListContainer();
    userSection.style.display = 'block'; // ����� ���� ǥ��
    usernameDisplay.textContent = localStorage.getItem('username'); // ����ڸ� ǥ��
} else {
    loginForm.style.display = 'block'; // �α��� �� ǥ��
}