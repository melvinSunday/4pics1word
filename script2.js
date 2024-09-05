const words = [
    { word: 'BATANES', images: ['img/capitol.png', 'img/lighthouse.png', 'img/vayang_right.png', 'img/vayang.png'] },
    { word: 'REACT', images: ['img/reacttttt.jpg', 'img/library.jpg', 'img/reactFace.jpg','img/Hook.png' ] },
    { word: 'ALICE', images: ['img/aliceT.jpg', 'img/running.jpg', 'img/ap.jpg', 'img/aliceML.jpg'] },
];

let currentWord;
let guessedWord;
let shuffledLetters;
let originalLetterPositions;
let isMobileView = window.innerWidth < 768; // Assuming mobile breakpoint is 768px

const imagesContainer = document.querySelector('#images-container');
const wordContainer = document.querySelector('#word-container');
const lettersContainer = document.querySelector('#letters-container');
const submitBtn = document.querySelector('#submit-btn');
const message = document.querySelector('#message');

function initGame() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    guessedWord = Array(currentWord.word.length).fill('');
    shuffledLetters = shuffleWord(currentWord.word);

    const extraLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 3; i++) {
        shuffledLetters.push(extraLetters[Math.floor(Math.random() * extraLetters.length)]);
    }
    shuffledLetters = shuffleWord(shuffledLetters.join('')); 
    originalLetterPositions = [...shuffledLetters];

    const images = imagesContainer.getElementsByTagName('img');
    for (let i = 0; i < 4; i++) {
        images[i].src = currentWord.images[i];
    }

    wordContainer.innerHTML = '';
    for (let i = 0; i < currentWord.word.length; i++) {
        const letterSlot = document.createElement('div');
        letterSlot.classList.add('word-letter');
        if (!isMobileView) {
            letterSlot.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.target.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
            });
            letterSlot.addEventListener('dragleave', (e) => {
                e.target.style.boxShadow = 'none';
            });
            letterSlot.addEventListener('drop', (e) => {
                e.target.style.boxShadow = 'none';
                dropLetter(e, i);
            });
        }
        letterSlot.addEventListener('click', () => returnLetter(i));
        wordContainer.appendChild(letterSlot);
    }

    updateLettersContainer();

    message.textContent = '';
}

function updateLettersContainer() {
    const totalLetters = shuffledLetters.length;
    const lettersPerRow = Math.ceil(totalLetters / 2);

    const rows = [
        shuffledLetters.slice(0, lettersPerRow),
        shuffledLetters.slice(lettersPerRow)
    ];

    lettersContainer.innerHTML = rows.map(row => 
        `<div class="letter-row">
            ${row.map(letter => {
                if (isMobileView) {
                    return `<div class="letter-btn" onclick="clickLetter('${letter}')">${letter}</div>`;
                } else {
                    return `<div class="letter-btn" draggable="true" ondragstart="dragStart(event, '${letter}')" ondragend="dragEnd(event)">${letter}</div>`;
                }
            }).join('')}
        </div>`
    ).join('');
}

function shuffleWord(word) {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters;
}

function dragStart(e, letter) {
    e.dataTransfer.setData('text/plain', letter);
    e.target.style.opacity = '0.5';
}

function dragEnd(e) {
    e.target.style.opacity = '1';
}

function dropLetter(e, index) {
    e.preventDefault();
    const letter = e.dataTransfer.getData('text');
    if (guessedWord[index] === '') {
        guessedWord[index] = letter;
        updateWordDisplay();
        removeLetter(letter);
    }
}

function clickLetter(letter) {
    const emptyIndex = guessedWord.findIndex(l => l === '');
    if (emptyIndex !== -1) {
        guessedWord[emptyIndex] = letter;
        updateWordDisplay();
        removeLetter(letter);
    }
}

function updateWordDisplay() {
    const letterSlots = wordContainer.getElementsByClassName('word-letter');
    for (let i = 0; i < guessedWord.length; i++) {
        letterSlots[i].textContent = guessedWord[i];
    }
}

function removeLetter(letter) {
    const index = shuffledLetters.indexOf(letter);
    if (index > -1) {
        shuffledLetters.splice(index, 1);
        updateLettersContainer();
    }
}

const returnLetter = (index) => {
    const letter = guessedWord[index];
    if (letter !== '') {
        guessedWord[index] = '';
        updateWordDisplay();
        addLetter(letter);
    }
}

const addLetter = (letter) => {
    const originalIndex = originalLetterPositions.indexOf(letter);
    if (originalIndex !== -1) {
        shuffledLetters.splice(originalIndex, 0, letter);
    } else {
        shuffledLetters.push(letter);
    }
    updateLettersContainer();
}

const checkWord = () =>{
    if (guessedWord.join('') === currentWord.word) {
        message.textContent = 'May Tama ka!';
        message.style.color = 'green';
        setTimeout(initGame, 2000);
    } else {
        message.textContent = 'Wala kang tama!';
        message.style.color = 'red';
        guessedWord = Array(currentWord.word.length).fill('');
        updateWordDisplay();
        resetLetters();
    }
}

const resetLetters = () => {
    shuffledLetters = [...originalLetterPositions];
    updateLettersContainer();
}

submitBtn.addEventListener('click', checkWord);

window.addEventListener('resize', () => {
    const newIsMobileView = window.innerWidth < 768;
    if (newIsMobileView !== isMobileView) {
        isMobileView = newIsMobileView;
        updateLettersContainer();
    }
});

initGame();