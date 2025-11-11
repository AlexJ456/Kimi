// Box Breathing App Logic
class BoxBreathingApp {
    constructor() {
        this.phaseDurations = [4, 4, 4, 4]; // inhale, hold, exhale, wait
        this.currentPhase = 0; // 0: inhale, 1: hold, 2: exhale, 3: wait
        this.phaseTimeRemaining = 4;
        this.totalTimeElapsed = 0;
        this.isRunning = false;
        this.timeLimit = null; // in seconds, null for unlimited
        this.intervalId = null;
        this.hasShownTotalTime = false;
        
        this.phaseNames = ['inhale', 'hold', 'exhale', 'wait'];
        this.dotPositions = ['position-0', 'position-1', 'position-2', 'position-3'];
        
        this.initializeElements();
        this.bindEvents();
        this.updateDurationDisplay();
    }

    initializeElements() {
        // Home page elements
        this.homePage = document.getElementById('homePage');
        this.durationSlider = document.getElementById('durationSlider');
        this.durationValue = document.getElementById('durationValue');
        this.startButton = document.getElementById('startButton');
        this.shortcutButtons = document.querySelectorAll('.shortcut-btn');
        
        // Exercise page elements
        this.exercisePage = document.getElementById('exercisePage');
        this.phaseName = document.getElementById('phaseName');
        this.phaseTimer = document.getElementById('phaseTimer');
        this.totalTimer = document.getElementById('totalTimer');
        this.breathingDot = document.getElementById('breathingDot');
        this.stopButton = document.getElementById('stopButton');
    }

    bindEvents() {
        this.durationSlider.addEventListener('input', () => this.updateDurationDisplay());
        
        this.startButton.addEventListener('click', () => this.startExercise());
        
        this.shortcutButtons.forEach(btn => {
            btn.addEventListener('click', () => this.setTimeLimit(parseInt(btn.dataset.time)));
        });
        
        this.stopButton.addEventListener('click', () => this.stopExercise());
    }

    updateDurationDisplay() {
        const duration = parseFloat(this.durationSlider.value);
        this.durationValue.textContent = duration;
        this.phaseDurations = [duration, duration, duration, duration];
    }

    setTimeLimit(minutes) {
        this.shortcutButtons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        this.timeLimit = minutes * 60; // Convert to seconds
    }

    startExercise() {
        // Reset state
        this.currentPhase = 0;
        this.phaseTimeRemaining = this.phaseDurations[0];
        this.totalTimeElapsed = 0;
        this.isRunning = true;
        this.hasShownTotalTime = false;
        
        // Update UI
        this.homePage.classList.add('hidden');
        this.exercisePage.classList.add('active');
        this.updatePhaseDisplay();
        this.updateTotalTimer();
        
        // Start the exercise loop
        this.runExercise();
    }

    runExercise() {
        const tick = () => {
            if (!this.isRunning) return;
            
            // Decrement timers
            this.phaseTimeRemaining -= 0.1;
            this.totalTimeElapsed += 0.1;
            
            // Update displays
            this.updatePhaseDisplay();
            this.updateTotalTimer();
            
            // Check for phase transition
            if (this.phaseTimeRemaining <= 0) {
                this.transitionToNextPhase();
            }
            
            // Check time limit (if set)
            if (this.timeLimit && this.totalTimeElapsed >= this.timeLimit) {
                if (this.currentPhase === 2) { // Currently in exhale phase
                    this.stopExercise();
                    return;
                } else if (!this.hasShownTotalTime) {
                    // Continue until next exhale
                    this.hasShownTotalTime = true;
                    this.timeLimit = null; // Disable further checks
                }
            }
        };
        
        // Run every 100ms for smooth updates
        this.intervalId = setInterval(tick, 100);
    }

    transitionToNextPhase() {
        // Add pulse effect
        this.breathingDot.classList.add('pulse');
        setTimeout(() => this.breathingDot.classList.remove('pulse'), 600);
        
        // Move to next phase
        this.currentPhase = (this.currentPhase + 1) % 4;
        this.phaseTimeRemaining = this.phaseDurations[this.currentPhase];
        
        // Update dot position
        this.updateDotPosition();
        this.updatePhaseDisplay();
    }

    updateDotPosition() {
        // Remove all position classes
        this.dotPositions.forEach(pos => this.breathingDot.classList.remove(pos));
        // Add current position
        this.breathingDot.classList.add(this.dotPositions[this.currentPhase]);
    }

    updatePhaseDisplay() {
        this.phaseName.textContent = this.phaseNames[this.currentPhase];
        this.phaseTimer.textContent = Math.max(0, this.phaseTimeRemaining).toFixed(1);
    }

    updateTotalTimer() {
        const minutes = Math.floor(this.totalTimeElapsed / 60);
        const seconds = Math.floor(this.totalTimeElapsed % 60);
        this.totalTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    stopExercise() {
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        // Reset UI
        this.exercisePage.classList.remove('active');
        this.homePage.classList.remove('hidden');
        this.shortcutButtons.forEach(btn => btn.classList.remove('active'));
        this.timeLimit = null;
        
        // Reset dot position
        this.breathingDot.classList.remove(...this.dotPositions);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BoxBreathingApp();
});
