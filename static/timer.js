document.addEventListener("DOMContentLoaded", function () {

    // ================= TIMER =================
    const mainTime = document.getElementById("mainTime");
    const secondsText = document.getElementById("seconds");
    const timeDisplay = document.getElementById("time");
    const statusText = document.getElementById("status");
    const inputBox = document.getElementById("minutes");

    let totalTime = 25 * 60;
    let timer = null;
    let isRunning = false;

    function updateDisplay() {
        if (!mainTime || !secondsText) return;

        let m = Math.floor(totalTime / 60);
        let s = totalTime % 60;

        mainTime.innerText =
            `${String(m).padStart(2, "0")} : ${String(s).padStart(2, "0")}`;
    }

    // SET TIMER
    window.setTimer = function () {
        let min = parseInt(inputBox.value);

        if (isNaN(min) || min <= 0) {
            statusText.innerText = "Enter valid minutes ❗";
            return;
        }

        totalTime = min * 60;
        updateDisplay();

        statusText.innerText = "Timer set ✅";
        inputBox.value = "";
    };

    // ENTER SUPPORT
    if (inputBox) {
        inputBox.addEventListener("keydown", function (e) {
            if (e.key === "Enter") setTimer();
        });
    }

    // START TIMER
    window.startTimer = function () {
        if (isRunning) return;

        if (totalTime <= 0) {
            statusText.innerText = "Set time first ⏱️";
            return;
        }

        isRunning = true;

        statusText.innerText = "Running 🚀";

        if (timeDisplay) timeDisplay.classList.add("big");

        timer = setInterval(() => {
            if (totalTime > 0) {
                totalTime--;
                updateDisplay();
            } else {
                clearInterval(timer);
                timer = null;
                isRunning = false;

                statusText.innerText = "Time's up 🎉";

                if (timeDisplay) timeDisplay.classList.remove("big");
            }
        }, 1000);
    };

    // PAUSE
    window.pauseTimer = function () {
        clearInterval(timer);
        timer = null;
        isRunning = false;
        statusText.innerText = "Paused ⏸️";
    };

    // RESET
    window.resetTimer = function () {
        clearInterval(timer);
        timer = null;
        isRunning = false;

        totalTime = 25 * 60;
        updateDisplay();

        if (timeDisplay) timeDisplay.classList.remove("big");

        statusText.innerText = "Reset 🔄";
    };

    updateDisplay();


    // ================= STOPWATCH =================
    const swTimeDisplay = document.getElementById("swTime");
    const swStatus = document.getElementById("swStatus");

    let swSeconds = 0;
    let swInterval = null;

    function updateSW() {
        if (!swTimeDisplay) return;

        let hrs = Math.floor(swSeconds / 3600);
        let min = Math.floor((swSeconds % 3600) / 60);
        let sec = swSeconds % 60;

        swTimeDisplay.innerText =
            String(hrs).padStart(2, "0") + " : " +
            String(min).padStart(2, "0") + " : " +
            String(sec).padStart(2, "0");
    }

    window.startSW = function () {
        if (swInterval) return;

        swInterval = setInterval(() => {
            swSeconds++;
            updateSW();
        }, 1000);

        if (swStatus) swStatus.innerText = "Running 🚀";
    };

    window.pauseSW = function () {
        clearInterval(swInterval);
        swInterval = null;

        if (swStatus) swStatus.innerText = "Paused ⏸️";
    };

    window.resetSW = function () {
        clearInterval(swInterval);
        swInterval = null;
        swSeconds = 0;
        updateSW();

        if (swStatus) swStatus.innerText = "Reset 🔄";
    };

    updateSW();


    // ================= TAB SWITCH =================
    window.showSection = function (id, el) {
        document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");

        const target = document.getElementById(id);
        if (target) target.style.display = "block";

        document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
        if (el) el.classList.add("active");
    };

});