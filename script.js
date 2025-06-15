
const WORD_LENGTH = 3;
const MAX_GUESSES = 6;
const validWords = DAILY_WORDS;

const todayIndex = Math.floor((new Date() - new Date(2024, 0, 1)) / (1000 * 60 * 60 * 24)) % validWords.length;
const secretWord = validWords[todayIndex];
const secretArray = Array.from(secretWord.matchAll(/ts|kw|./g), m => m[0]);

let currentGuess = [];
let currentRow = 0;
let results = [];

window.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.getElementById('game-board');
  const keyboard = document.getElementById('keyboard-container');
  const messageContainer = document.getElementById('message-container');
  const shareButton = document.getElementById('share-button');

  function createBoard() {
    for (let r = 0; r < MAX_GUESSES; r++) {
      const row = document.createElement('div');
      row.classList.add('row');
      row.setAttribute('id', 'row-' + r);
      for (let i = 0; i < WORD_LENGTH; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('id', 'tile-' + r + '-' + i);
        row.appendChild(tile);
      }
      gameBoard.appendChild(row);
    }
  }

  function createKeyboard() {
    const keys = [
      'b', 'h', 'k', 'kw', 'm', 'n', 'p', 'r', 's', 't',
      'ts', 'w', 'y', 'ʔ', 'a', 'e', 'i', 'o', 'u',
      'ʉ', 'a̠', 'e̠', 'i̠', 'o̠', 'u̠', 'ʉ̠',
      '←', '⏎'
    ];
    keys.forEach(key => {
      const button = document.createElement('button');
      button.textContent = key;
      button.classList.add('keyboard-button');
      button.addEventListener('click', () => handleKey(key));
      keyboard.appendChild(button);
    });
  }

  function handleKey(key) {
      // Clear the message when the player starts typing again
  messageContainer.textContent = "";
    if (key === '←') {
      currentGuess.pop();
    } else if (key === '⏎') {
      submitGuess();
      return;
    } else if (currentGuess.length < WORD_LENGTH) {
      currentGuess.push(key);
    }
    updateBoard();
  }

  function updateBoard() {
    for (let i = 0; i < WORD_LENGTH; i++) {
      const tile = document.getElementById(`tile-${currentRow}-${i}`);
      tile.textContent = currentGuess[i] || '';
    }
  }

  function submitGuess() {
    if (currentGuess.length !== WORD_LENGTH) return;
    const guess = currentGuess.join('');
    if (!validWords.includes(guess)) {
      showMessage('Invalid word');
      return;
    }

    let rowResult = '';

    for (let i = 0; i < WORD_LENGTH; i++) {
      const tile = document.getElementById(`tile-${currentRow}-${i}`);
      if (currentGuess[i] === secretArray[i]) {
        tile.style.backgroundColor = '#66b3ff';
        rowResult += '🟦';
      } else if (secretArray.includes(currentGuess[i])) {
        tile.style.backgroundColor = '#cce4ff';
        rowResult += '🩵';
      } else {
        tile.style.backgroundColor = '#ccc';
        rowResult += '⬜';
      }
    }

    results.push(rowResult);

    if (guess === secretArray.join('')) {
      showMessage("Tsaaku ʉnʉ̠!\nYou got it!");
      shareButton.style.display = "inline-block";
      const guessCount = currentRow + 1;
      shareButton.onclick = () => {
        const header = `Comanche Word Game 3 - ${guessCount}/${MAX_GUESSES}`;
        const full = `${header}\n${results.join('\n')}`;
        navigator.clipboard.writeText(full);
        alert("Score copied to clipboard!");
      };
    } else if (currentRow === MAX_GUESSES - 1) {
      showMessage(`The word was: <span style="color:#145374;">${secretArray.join('')}</span>`);
    }

    currentRow++;
    currentGuess = [];
  }

  function showMessage(msg) {
    messageContainer.innerHTML = msg;
    messageContainer.style.fontSize = "1.8em";
    messageContainer.style.fontWeight = "bold";
    messageContainer.style.marginTop = "1em";
  }

  createBoard();
  createKeyboard();
});
