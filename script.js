const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const bgMusic = document.getElementById('bg-music');
const soundToggle = document.getElementById('sound-toggle');

// --- 新增：获取新元素 ---
const minutesInput = document.getElementById('minutes-input'); // 输入框
const setTimeBtn = document.getElementById('set-time-btn');    // 设定按钮
const bgThumbs = document.querySelectorAll('.bg-thumb');       // 所有背景缩略图
// ----------------------

let currentModeTime = 25 * 60; // 默认 25 分钟
let timeLeft = currentModeTime;
let timerId = null;
let isRunning = false;

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
    const displaySeconds = seconds < 10 ? '0' + seconds : seconds;
    timerDisplay.textContent = `${displayMinutes}:${displaySeconds}`;
    document.title = `${displayMinutes}:${displaySeconds} - 专注中`;
}

function toggleTimer() {
    if (isRunning) {
        clearInterval(timerId);
        startBtn.textContent = "继续专注";
        isRunning = false;
        bgMusic.pause();
    } else {
        startBtn.textContent = "暂停";
        isRunning = true;
        if (soundToggle.checked) bgMusic.play().catch(e => console.log(e));
        
        timerId = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timerId);
                bgMusic.pause();
                bgMusic.currentTime = 0;
                alert("专注完成！");
                resetTimer();
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerId);
    isRunning = false;
    // 重置回当前设定的时间
    timeLeft = currentModeTime;
    
    startBtn.textContent = "开始专注";
    document.title = "极简专注时钟";
    bgMusic.pause();
    bgMusic.currentTime = 0;
    updateDisplay();
}

// === 新增功能 1：设定任意时间的逻辑 ===
setTimeBtn.addEventListener('click', function() {
    // 1. 获取输入框里的数字
    const minutes = parseInt(minutesInput.value);

    // 2. 验证输入是否合法（必须是大于0的数字）
    if (isNaN(minutes) || minutes <= 0) {
        alert("请输入有效的时间（大于0分钟）");
        return; // 如果不合法，直接结束，不往下执行
    }

    // 3. 更新全局时间变量
    currentModeTime = minutes * 60;
    
    // 4. 立即重置计时器，应用新时间
    resetTimer();
});
// ==================================


// === 新增功能 2：切换背景的逻辑 ===
// 定义一个函数用来更换背景
function changeBackground(url) {
    // 动态修改 body 的背景图样式
    document.body.style.backgroundImage = `url('${url}')`;
}

// 给每个缩略图添加点击事件
bgThumbs.forEach(thumb => {
    thumb.addEventListener('click', function() {
        // 1. 移除其他缩略图的 active 样式
        bgThumbs.forEach(b => b.classList.remove('active'));
        // 2. 给自己加上 active 样式
        this.classList.add('active');
        // 3. 获取存在 data-bg 里的高清图链接
        const bigImgUrl = this.getAttribute('data-bg');
        // 4. 调用函数更换背景
        changeBackground(bigImgUrl);
    });
});

// 初始化：页面加载时，自动设置第一个 active 缩略图的背景
const initialBg = document.querySelector('.bg-thumb.active').getAttribute('data-bg');
changeBackground(initialBg);
// ==================================


soundToggle.addEventListener('change', function() {
    if (isRunning) {
        this.checked ? bgMusic.play() : bgMusic.pause();
    }
});

startBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);

updateDisplay();