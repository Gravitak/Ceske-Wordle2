const board = document.getElementById("board");
const keyboard = document.getElementById("keyboard");
const restartButton = document.getElementById("restart");

let secretWord = ""; // Tajné slovo
let currentRow = 0;
let currentCol = 0;
let isGameOver = false;

// Načtení slov z words.txt
fetch('words.txt')
    .then(response => response.text())
    .then(data => {
        const words = data
            .split('\n')
            .map(word => word.trim().split("/")[0]) // Oříznutí a odstranění /
            .filter(word => word.length === 5); // Pouze slova o délce 5 písmen
        secretWord = words[Math.floor(Math.random() * words.length)].toLowerCase();
        console.log("Tajné slovo:", secretWord);
        initializeGame();
    });
    

function initializeGame() {
    // Vytvoření hrací plochy
    for (let i = 0; i < 6; i++) {
        const row = document.createElement("div");
        row.classList.add("row");
        for (let j = 0; j < 5; j++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            row.appendChild(tile);
        }
        board.appendChild(row);
    }
    function processText(input) {
        // Odstranění lomítek
        const cleanedText = input.replace(/\//g, '');
        
        // Rozdělení textu na jednotlivá slova
        const words = cleanedText.split(/\s+/);
        
        // Filtrace slov s přesně 5 písmeny
        const fiveLetterWords = words.filter(word => word.length === 5);
        
        return fiveLetterWords;
    }

    // Vytvoření virtuální klávesnice
    const letters = "qwertzuiopasdfghjklxcvbnměščřžýáíé".split("");
    letters.forEach(letter => {
        const key = document.createElement("div");
        key.classList.add("key");
        key.textContent = letter;
        key.addEventListener("click", () => handleInput(letter));
        keyboard.appendChild(key);
    });

    // Přiřazení fyzické klávesnice
    document.addEventListener("keydown", handleKeyboardInput);
    restartButton.addEventListener("click", resetGame);
}

function handleInput(letter) {
    if (isGameOver) return;
    if (letter === "enter") {
        checkWord();
        console.log("Checked")
    } else if (letter === "backspace") {
        deleteLetter();
    } else if (currentCol < 5 && /^[a-zěščřžýáíéůúťň]$/i.test(letter)) {
        const row = board.children[currentRow];
        const tile = row.children[currentCol];
        tile.textContent = letter.toUpperCase();
        currentCol++;
    }
}

function handleKeyboardInput(event) {
    const letter = event.key.toLowerCase();
    handleInput(letter);
}

function deleteLetter() {
    if (currentCol > 0) {
        currentCol--;
        const row = board.children[currentRow];
        const tile = row.children[currentCol];
        tile.textContent = "";
    }
}

function checkWord() {
    if (currentCol === 5) {
        const row = board.children[currentRow];
        let guess = "";

        // Poskládání hádaného slova
        for (let i = 0; i < 5; i++) {
            guess += row.children[i].textContent.toLowerCase();
        }

        // Kontrola, zda je slovo správné
        if (guess === secretWord) {
            markRow(row, "correct");
            alert("Gratulujeme! Uhodli jste slovo.");
            isGameOver = true;
            return;
        }

        // Zvýraznění písmen
        const secretLetters = secretWord.split("");
        const guessLetters = guess.split("");

        // Označení správných písmen na správné pozici
        for (let i = 0; i < 5; i++) {
            const tile = row.children[i];
            if (guessLetters[i] === secretLetters[i]) {
                tile.classList.add("correct");
                secretLetters[i] = null; // Zabrání duplicitnímu označení
                guessLetters[i] = null;
            }
        }

        // Označení správných písmen na špatné pozici
        for (let i = 0; i < 5; i++) {
            const tile = row.children[i];
            if (guessLetters[i] && secretLetters.includes(guessLetters[i])) {
                tile.classList.add("present");
                secretLetters[secretLetters.indexOf(guessLetters[i])] = null;
            } else if (guessLetters[i]) {
                tile.classList.add("absent");
            }
        }

        // Přechod na další řádek
        currentRow++;
        currentCol = 0;

        if (currentRow === 6) {
            alert(`Prohráli jste. Tajné slovo bylo: ${secretWord}`);
            isGameOver = true;
        }
    }
}

function markRow(row, className) {
    for (const tile of row.children) {
        tile.classList.add(className);
    }
}

function resetGame() {
    board.innerHTML = "";
    keyboard.innerHTML = "";
    currentRow = 0;
    currentCol = 0;
    isGameOver = false;

    // Načtení nového tajného slova
    fetch("words.txt")
        .then(response => response.text())
        .then(data => {
            const words = data.split("\n").map(word => word.trim()).filter(word => word.length === 5);
            secretWord = words[Math.floor(Math.random() * words.length)].toLowerCase();
            console.log("Nové tajné slovo:", secretWord);
            initializeGame();
        });
}
