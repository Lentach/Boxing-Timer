// src/script.js: Getting references to DOM elements
console.log("src/script.js: Getting DOM elements");
const timerDisplayElement = document.getElementById('timer-display');
const statusIndicatorElement = document.getElementById('status-indicator');
const roundCounterElement = document.getElementById('round-counter');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const resetButton = document.getElementById('reset-button');

// src/script.js: Defining constants for timer configuration
console.log("src/script.js: Defining timer constants");
const ROUND_DURATION = 180; // 3 minutes in seconds
const REST_DURATION = 60;  // 1 minute in seconds
const TOTAL_ROUNDS = 12;    // Default number of rounds

// src/script.js: Defining state variables
console.log("src/script.js: Defining state variables");
let timerInterval = null;    // Holds the interval ID for the timer
let currentTime = ROUND_DURATION; // Time remaining in the current interval (starts with round duration)
let currentRound = 1;       // Current round number
let isResting = false;     // Flag to indicate if it's a rest period
let isRunning = false;     // Flag to indicate if the timer is currently running

// src/script.js: Function to format time (MM:SS)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

// src/script.js: Function to update the display (now updates HTML elements)
function updateDisplay() {
    const formattedTime = formatTime(currentTime);
    let statusText = '';
    let statusClass = '';

    if (isRunning) {
        if (isResting) {
            statusText = 'REST';
            statusClass = 'rest';
        } else {
            statusText = 'WORK';
            statusClass = 'work';
        }
    } else {
        // Check specific conditions for status text and class
        if (!timerInterval && currentRound > TOTAL_ROUNDS) {
            // Special case for workout finished state
            statusText = 'FINISHED';
            statusClass = 'finished'; // Use specific class
            // Time display might show 00:00 or the reset time depending on exact logic flow in tick()
        } else if (!timerInterval && currentRound === 1 && currentTime === ROUND_DURATION && !isResting) {
            statusText = 'PREPARE';
            statusClass = 'prepare';
        } else {
             statusText = 'PAUSED';
             statusClass = 'paused';
        }
    }

    // Update HTML elements
    timerDisplayElement.textContent = formattedTime;
    statusIndicatorElement.textContent = statusText;
    // Ensure round counter doesn't show invalid round after finish
    if (statusText === 'FINISHED') {
         roundCounterElement.textContent = `Total Rounds: ${TOTAL_ROUNDS}`;
    } else {
         roundCounterElement.textContent = `Round ${currentRound} / ${TOTAL_ROUNDS}`;
    }

    // Update status indicator styling via CSS class
    statusIndicatorElement.className = ''; // Clear previous classes
    statusIndicatorElement.classList.add(statusClass); // Add the current status class


    console.log(`src/script.js: updateDisplay - Time: ${formattedTime}, Round: ${currentRound}/${TOTAL_ROUNDS}, Status: ${statusText}, isRunning: ${isRunning}`);
}

// src/script.js: The main timer tick function, called every second
function tick() {
    // console.log(`src/script.js: tick() called, currentTime before decrement: ${currentTime}`); // Reduced log frequency
    if (currentTime > 0) {
        currentTime--;
    } else { // currentTime is 0, handle transition
        console.log(`src/script.js: tick - Interval ended (isResting: ${isResting})`);
        if (!isResting) { // WORK round finished, start REST
            isResting = true;
            currentTime = REST_DURATION;
            console.log(`src/script.js: tick - Starting REST period for round ${currentRound}. Duration: ${REST_DURATION}s`);
            // Optional: Add sound notification for rest start
        } else { // REST period finished, start next WORK round or end workout
            currentRound++;
            if (currentRound <= TOTAL_ROUNDS) {
                isResting = false;
                currentTime = ROUND_DURATION;
                console.log(`src/script.js: tick - Starting WORK period for round ${currentRound}. Duration: ${ROUND_DURATION}s`);
                // Optional: Add sound notification for work start
            } else {
                console.log("src/script.js: tick - Workout Complete!");
                // Stop the interval
                clearInterval(timerInterval);
                timerInterval = null;
                isRunning = false;
                // Don't reset state immediately, just update display to 'FINISHED'
                // resetTimer(false); // Remove automatic reset
                console.log("src/script.js: tick - Timer stopped after completion.");
                updateDisplay(); // Call updateDisplay to show FINISHED state
                return; // Exit tick early as workout is finished
            }
        }
    }
    // Update display after potential state change or time decrement
    updateDisplay();
}

// src/script.js: Function to start the timer
function startTimer() {
    console.log(`src/script.js: startTimer called, isRunning: ${isRunning}`);
    if (!isRunning) {
        // Handle edge case: if workout finished, reset before starting again
        if(currentRound > TOTAL_ROUNDS) {
            console.log("src/script.js: startTimer - Workout was finished, resetting before start.");
            resetTimer(false); // Reset silently
        }

        isRunning = true;
         // Ensure display updates immediately to 'WORK' or 'REST' when starting/resuming
        updateDisplay(); // Update display immediately before starting interval

        // Log starting state
        if (isResting) {
             console.log(`src/script.js: startTimer - Resuming/Starting REST period.`);
        } else {
             console.log(`src/script.js: startTimer - Resuming/Starting WORK period for round ${currentRound}.`);
        }

        // Start the interval timer, calling tick every 1000ms (1 second)
        timerInterval = setInterval(tick, 1000);
        console.log(`src/script.js: startTimer - Interval set with ID: ${timerInterval}`);
    } else {
        console.log("src/script.js: startTimer - Timer is already running.");
    }
}

// src/script.js: Function to stop (pause) the timer
function stopTimer() {
    console.log(`src/script.js: stopTimer called, isRunning: ${isRunning}`);
    // Allow stopping even if finished, in case user wants to pause on the finished screen
    if (isRunning) {
        clearInterval(timerInterval);
        timerInterval = null; // Clear the interval ID
        isRunning = false;
        console.log("src/script.js: stopTimer - Interval cleared.");
        updateDisplay(); // Update display to show 'PAUSED' status
    } else {
        console.log("src/script.js: stopTimer - Timer is not running.");
    }
}

// src/script.js: Function to reset the timer to its initial state
function resetTimer(logAction = true) {
    if (logAction) {
        console.log("src/script.js: resetTimer called");
    }
    // Ensure any running interval is cleared first
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    // Reset state variables
    currentRound = 1;
    isResting = false;
    currentTime = ROUND_DURATION;
    isRunning = false; // Make sure isRunning is false after reset
    if (logAction) {
         console.log("src/script.js: resetTimer - State reset to initial values.");
    }
    updateDisplay(); // Update display to show the reset state ('PREPARE')
}


// src/script.js: Adding Event Listeners to buttons
console.log("src/script.js: Adding event listeners to buttons");
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', () => resetTimer(true)); // Pass true to ensure logging

// src/script.js: Initial setup when the script loads
console.log("src/script.js: Initializing timer state and display on script load.");
// Set the initial display without starting the timer
updateDisplay(); // Call initially to show default state (e.g., 03:00, Round 1, PREPARE)

console.log("src/script.js: UI integration complete. Timer should be interactive.");