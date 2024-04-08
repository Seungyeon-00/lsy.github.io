// 시계 기능
function updateClock() {
    const now = new Date();
    const clock = document.getElementById('clock');
    clock.innerText = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);

// OpenWeatherMap API를 사용한 날씨 기능
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


// 사용자명을 위한 로컬 스토리지
const loginForm = document.getElementById('loginForm');
const userSection = document.getElementById('userSection');
const usernameDisplay = document.getElementById('usernameDisplay');
const logoutBtn = document.getElementById('logoutBtn');

// 사용자가 이미 로그인되어 있는지 확인
const storedUsername = localStorage.getItem('username');
if (storedUsername) {
    loginForm.style.display = 'none'; // 로그인 양식 숨기기
    userSection.style.display = 'block'; // 사용자 섹션 표시
    usernameDisplay.textContent = storedUsername;  // 사용자명 표시
    //logoutBtn.style.display = 'block'; // 로그아웃 버튼 표시
} else {
    logoutBtn.style.display = 'none'; // 로그아웃 버튼을 로그인하지 않았을 때 숨기기
}

// 로그인 이벤트
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();
    localStorage.setItem('username', username); // 로컬 스토리지에 사용자명 저장
    usernameDisplay.textContent = username; // 사용자명 표시
    loginForm.style.display = 'none';  // 로그인 양식 숨기기
    userSection.style.display = 'block'; // 사용자 섹션 표시
    logoutBtn.style.display = 'block'; // 로그아웃 버튼 표시
});

// 로그아웃 버튼 클릭 이벤트
logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('username'); // 로컬 스토리지에서 사용자명 제거
    localStorage.removeItem('list'); // 로컬 스토리지에서 할 일 목록 제거
    location.reload(); // 페이지 새로 고침 -> 로그아웃시 모든것 초기화
});

// To Do List 
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');

// 로컬 스토리지에서 To Do List 
document.addEventListener('DOMContentLoaded', function() {
    const storedList = JSON.parse(localStorage.getItem('list')) || [];
    storedList.forEach(item => {
        addTodoItem(item);
    });
});

// 목록에 To Do List 추가
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

// 목록에서 To Do List제거
function removeTodoItem(item) {
    todoList.removeChild(item); // DOM에서 항목 제거
    saveTodoList(); // todo list 로컬 스토리지에 저장
}

// todo list 추가
document.getElementById('addTodoBtn').addEventListener('click', function() {
    const todo = todoInput.value.trim();
    if (todo !== '') {
        addTodoItem(todo);
        todoInput.value = ''; // 할 일 추가 후 입력 필드 지우기
        saveTodoList(); // 할 일 목록을 로컬 스토리지에 저장
    }
});

// todo list 로컬 스토리지에 저장
function saveTodoList() {
    const todoItems = Array.from(todoList.children).map(li => li.firstChild.textContent);
    localStorage.setItem('list', JSON.stringify(todoItems));
}

// 랜덤 이미지
function displayRandomImage() {
    const images = ['img1.jpg', 'img2.jpg', 'img3.jpg']; // 이미지 파일 이름 배열
    let currentIndex = 0;
    const randomImageDiv = document.getElementById('randomImage');

    // 이미지 업데이트 함수
    function updateImage() {
        const imagePath = images[currentIndex]; // 이미지 경로 생성 (이미지가 index.html과 같은 경로에 있는 경우)
        randomImageDiv.innerHTML = `<img src="${imagePath}" alt="Image">`;
    }

    // 이미지 초기화
    updateImage();

    // 클릭 이벤트 리스너를 사용하여 이미지 변경
    randomImageDiv.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % images.length; // 배열에서 다음 이미지로 이동
        updateImage();
    });
}
displayRandomImage(); // 초기에 호출

// 초기화: 사용자가 이미 로그인되어 있는 경우 todo list, 사용자 섹션 표시
if (localStorage.getItem('username')) {
    showTodoListContainer();
    userSection.style.display = 'block'; // 사용자 섹션 표시
    usernameDisplay.textContent = localStorage.getItem('username'); // 사용자명 표시
} else {
    loginForm.style.display = 'block'; // 로그인 폼 표시
}