// Set up the game board as an array
let board = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];

// Define initial scores and tokens
let scores = {
    "PlayerX": 0,
    "PlayerO": 0,
    "AI": 0
};

let tokens = {
    "PlayerX": 0,
    "PlayerO": 0
};

// Define references to HTML elements
const cells = document.querySelectorAll('.cell');
const messageEl = document.getElementById('message');
const scoreEl = document.getElementById('score');
const boardDiv = document.getElementById('board');
const statusDiv = document.getElementById('status');
const themeBtn = document.getElementById('themeBtn');

let gameMode;
let currentPlayer = "PlayerX"; // Start with PlayerX in both modes
let gameOver = false;
let playerXName = "";
let playerOName = "";

// Function to print the game board
function printBoard() {
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
    });
}

// Function to handle a player's turn
function takeTurn(player, index) {
    if (board[index] === "-" && !gameOver) {
        board[index] = player === "PlayerX" ? "X" : "O";
        printBoard();

        let gameResult = checkGameOver();
        if (gameResult === "win") {
            let winnerName = (player === "AI") ? "AI" : (currentPlayer === "PlayerX" ? playerXName : playerOName);
            messageEl.textContent = `${winnerName} wins!`;
            if (player === "AI") {
                scores["AI"]++;
            } else {
                scores[currentPlayer]++;
                tokens[currentPlayer]++; // Award a token to the winning player
            }
            printScores();
            gameOver = true;
            setTimeout(resetGame, 2000); // Reset game after a short delay
        } else if (gameResult === "tie") {
            messageEl.textContent = "It's a tie!";
            printScores();
            gameOver = true;
            setTimeout(resetGame, 2000); // Reset game after a short delay
        } else {
            // Switch to the other player
            currentPlayer = currentPlayer === "PlayerX" ? "PlayerO" : "PlayerX";
            if (gameMode === "1" && currentPlayer === "PlayerO") {
                // AI's turn in Player vs AI mode
                setTimeout(() => {
                    let position = getAIMove();
                    takeTurn("AI", position);
                }, 500);
            }
        }
    }
}

// Define a function for AI to make a random move
function getAIMove() {
    let availablePositions = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "-") {
            availablePositions.push(i);
        }
    }
    // Choose a random available position
    let randomIndex = Math.floor(Math.random() * availablePositions.length);
    return availablePositions[randomIndex];
}

// Define a function to check if the game is over
function checkGameOver() {
    // Check for a win
    if ((board[0] === board[1] && board[1] === board[2] && board[0] !== "-") ||
        (board[3] === board[4] && board[4] === board[5] && board[3] !== "-") ||
        (board[6] === board[7] && board[7] === board[8] && board[6] !== "-") ||
        (board[0] === board[3] && board[3] === board[6] && board[0] !== "-") ||
        (board[1] === board[4] && board[4] === board[7] && board[1] !== "-") ||
        (board[2] === board[5] && board[5] === board[8] && board[2] !== "-") ||
        (board[0] === board[4] && board[4] === board[8] && board[0] !== "-") ||
        (board[2] === board[4] && board[4] === board[6] && board[2] !== "-")) {
        return "win";
    }
    // Check for a tie
    else if (!board.includes("-")) {
        return "tie";
    }
    // Game is not over
    else {
        return "play";
    }
}

// Function to print scores and tokens
function printScores() {
    if (gameMode === "1") {
        // AI vs Player mode
        scoreEl.textContent = `Score - ${playerXName}: ${scores["PlayerX"]} | AI: ${scores["AI"]} | Tokens - ${playerXName}: ${tokens["PlayerX"]}`;
    } else {
        // Player vs Player mode
        scoreEl.textContent = `Score - ${playerXName}: ${scores["PlayerX"]} | ${playerOName}: ${scores["PlayerO"]} | Tokens - ${playerXName}: ${tokens["PlayerX"]} | ${playerOName}: ${tokens["PlayerO"]}`;
    }
}

// Function to reset the game
function resetGame() {
    board = ["-", "-", "-", "-", "-", "-", "-", "-", "-"]; // Reset board
    currentPlayer = "PlayerX"; // Reset current player
    gameOver = false; // Reset game over flag
    printBoard();
}

// Function to reset scores and tokens
function resetScoresAndTokens() {
    scores = {
        "PlayerX": 0,
        "PlayerO": 0,
        "AI": 0
    };
    tokens = {
        "PlayerX": 0,
        "PlayerO": 0
    };
}

// Event listeners for game mode buttons
document.getElementById('aiVsPlayer').addEventListener('click', () => {
    resetScoresAndTokens();
    gameMode = "1"; // AI vs Player
    playerXName = prompt("Enter Player X's name:") || "Player X";
    playerOName = "AI"; // No need to prompt for AI name
    boardDiv.style.display = 'grid';
    statusDiv.style.display = 'block';
    resetGame();
    printScores();
});

document.getElementById('playerVsPlayer').addEventListener('click', () => {
    resetScoresAndTokens();
    gameMode = "2"; // Player vs Player
    playerXName = prompt("Enter Player X's name:") || "Player X";
    playerOName = prompt("Enter Player O's name:") || "Player 2";
    boardDiv.style.display = 'grid';
    statusDiv.style.display = 'block';
    resetGame();
    printScores();
});

// Event listener for theme change button (example)
themeBtn.addEventListener('click', () => {
    // Example of changing the background color as a theme
    if (tokens[currentPlayer] > 0) {
        document.body.style.backgroundColor = getRandomColor(); // Replace with your theme change logic
        tokens[currentPlayer]--; // Deduct a token
        printScores();
    } else {
        alert("You don't have enough tokens to change the theme.");
    }
});

// Example function to generate a random color
function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

// Event listeners for cells
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => takeTurn(currentPlayer, index));
});

// Initial print of scores
printScores();