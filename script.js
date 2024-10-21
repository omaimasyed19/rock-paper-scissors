const choices = ['rock', 'paper', 'scissors'];
const emojis = { 'rock': '🪨', 'paper': '📄', 'scissors': '✂️' };
const playerScore = document.getElementById('player-score');
const computerScore = document.getElementById('computer-score');
const result = document.getElementById('result');
const choiceButtons = document.querySelectorAll('.choice');
const restartBtn = document.getElementById('restart');
const playAgainBtn = document.getElementById('play-again');
const timerBar = document.getElementById('timer-bar');
const timerText = document.getElementById('timer-text');
const totalTimeDisplay = document.getElementById('total-time');
const modal = document.getElementById('confirmation-modal');
const confirmRestartBtn = document.getElementById('confirm-restart');
const cancelRestartBtn = document.getElementById('cancel-restart');
const battleArena = document.getElementById('battle-arena');
const playerChoice = document.getElementById('player-choice');
const computerChoice = document.getElementById('computer-choice');
const themeSwitch = document.getElementById('theme-switch');
const themeLabel = document.getElementById('theme-label');
const clickSound = document.getElementById('click-sound');
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');
const drawSound = document.getElementById('draw-sound');

let playerPoints = 0;
let computerPoints = 0;
let timeLeft = 10;
let timerInterval = null;
let totalSeconds = 0;
let totalTimeInterval = null;

function computerPlay() {
    return choices[Math.floor(Math.random() * choices.length)];
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play().catch(error => console.error('Error playing sound:', error));
}

function playRound(playerSelection) {
    const computerSelection = computerPlay();
    animateBattle(playerSelection, computerSelection);
    setTimeout(() => {
        if (playerSelection === computerSelection) {
            result.textContent = "It's a draw!";
            playSound(drawSound);
            animateDraw();
        } else if (
            (playerSelection === 'rock' && computerSelection === 'scissors') ||
            (playerSelection === 'paper' && computerSelection === 'rock') ||
            (playerSelection === 'scissors' && computerSelection === 'paper')
        ) {
            result.textContent = `You win! ${emojis[playerSelection]} beats ${emojis[computerSelection]}`;
            playerPoints++;
            playSound(winSound);
            animateWinner('player');
        } else {
            result.textContent = `You lose! ${emojis[computerSelection]} beats ${emojis[playerSelection]}`;
            computerPoints++;
            playSound(loseSound);
            animateWinner('computer');
        }
        updateScore();
        clearInterval(timerInterval);
        playAgainBtn.style.display = 'inline-block';
    }, 1500);
}

function animateBattle(playerSelection, computerSelection) {
    playerChoice.textContent = emojis[playerSelection];
    computerChoice.textContent = emojis[computerSelection];
    playerChoice.style.opacity = '1';
    playerChoice.style.transform = 'scale(1) translateX(50px)';
    computerChoice.style.opacity = '1';
    computerChoice.style.transform = 'scale(1) translateX(-50px)';
    setTimeout(() => {
        playerChoice.style.transform = 'scale(1) translateX(0)';
        computerChoice.style.transform = 'scale(1) translateX(0)';
    }, 500);
}

function animateWinner(winner) {
    if (winner === 'player') {
        playerChoice.classList.add('winner');
        computerChoice.classList.add('loser');
    } else {
        computerChoice.classList.add('winner');
        playerChoice.classList.add('loser');
    }
    setTimeout(() => {
        playerChoice.classList.remove('winner', 'loser');
        computerChoice.classList.remove('winner', 'loser');
        resetBattleArena();
    }, 1000);
}

function animateDraw() {
    playerChoice.classList.add('draw');
    computerChoice.classList.add('draw');
    setTimeout(() => {
        playerChoice.classList.remove('draw');
        computerChoice.classList.remove('draw');
        resetBattleArena();
    }, 1000);
}

function resetBattleArena() {
    playerChoice.style.opacity = '0';
    playerChoice.style.transform = 'scale(0.5)';
    computerChoice.style.opacity = '0';
    computerChoice.style.transform = 'scale(0.5)';
}

function updateScore() {
    playerScore.textContent = playerPoints;
    computerScore.textContent = computerPoints;
}

function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    timeLeft = 10;
    timerBar.style.width = '100%';
    timerText.textContent = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft < 0) {
            timeLeft = 0;
        }
        timerBar.style.width = `${(timeLeft / 10) * 100}%`;
        timerText.textContent = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timerInterval);
            const randomChoice = computerPlay();
            playRound(randomChoice);
        }
    }, 1000);
}

function updateTotalTime() {
    totalSeconds++;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    totalTimeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startGame() {
    playerPoints = 0;
    computerPoints = 0;
    updateScore();
    result.textContent = '';
    playAgainBtn.style.display = 'none';
    resetBattleArena();
    startTimer();
    if (!totalTimeInterval) {
        totalTimeInterval = setInterval(updateTotalTime, 1000);
    }
}

function restartGame() {
    clearInterval(timerInterval);
    clearInterval(totalTimeInterval);
    totalSeconds = 0;
    totalTimeDisplay.textContent = '00:00';
    startGame();
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    themeLabel.textContent = document.body.classList.contains('dark-theme') ? 'Light Mode' : 'Dark Mode';
}

choiceButtons.forEach(button => {
    button.addEventListener('click', () => {
        playSound(clickSound);
        playRound(button.id);
    });
});

restartBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

confirmRestartBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    restartGame();
});

cancelRestartBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

playAgainBtn.addEventListener('click', () => {
    playAgainBtn.style.display = 'none';
    result.textContent = '';
    resetBattleArena();
    startTimer();
});

themeSwitch.addEventListener('change', toggleTheme);

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

startGame();
