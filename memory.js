const table = document.getElementById('table');
const classes = ['bard', 'barbarian', 'cleric', 'druid', 'fighter', 'bard', 'barbarian', 'cleric', 'druid', 'fighter'];
const filepathStem = "class-icons/";
//Mattheus said this is the correct way to do it, but I didn't really have to here, since it's just sticking the '.png' on the end. 
const imgSrc = {
    'bard': 'bard.png', 
    'barbarian': 'barbarian.png',
    'cleric': 'cleric.png', 
    'druid': 'druid.png',
    'fighter': 'fighter.png'
}
let score;
let lowScore = localStorage.getItem('lowScore');
let currentDeck;
let selectedCards = [];
const button = document.getElementById('new-game');
button.addEventListener('click', function () {
    if (lowScore == null) {
        firstGame(classes);
    } else {
        //can probably do a "new game" function and 'reset board' function
        newGame(classes);
    }
});

function setLowScore () {
    if (lowScore === null) {
        lowScore = 0;
    }
}

function shuffle(array) {
    let counter = array.length;
    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter--;

        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

function dealCards (array) {
    for (let className of array) {
        const newDiv = document.createElement('div');
        newDiv.style.zIndex = 100;
        newDiv.classList.add(className);
        newDiv.addEventListener('click', handleCardClick);
        table.appendChild(newDiv);
    }
}

function handleCardClick(event) {
    score++
    let classIcon = imgSrc[event.target.classList[0]];
    const image = document.createElement('img');
    image.src = `${filepathStem}${classIcon}`;
    image.classList.add('card');
    event.target.appendChild(image);

    selectedCards.push(event.target);
    if (selectedCards.length === 2) {
        if (checkMatch(selectedCards) === true) {
            noMatch(selectedCards);
        }
        else {
            foundMatch(selectedCards);
        }
    } else if (selectedCards.length > 2) {
        selectedCards = [];
        selectedCards.push(event.target);
    }
        trackScore();
}

function checkGameState() {
    let matchedCards = document.querySelectorAll("#matched");
    if (matchedCards.length === currentDeck.length) {
        if (score < lowScore) {
            trackScore();
        }
        return true;
    } else {
        return false;
    }
}

function checkMatch(array) {
    if (array.length === 2) {
        if (array[0].classList[0] === array[1].classList[0]) {
            return true;
        } else {
            return false;
        }
    } else {
        console.log('ERROR: there are too many, or too few, cards selected');
    }
}

function noMatch(array) {
    setTimeout(function () {
        for (let a of array) {
            a.id = "matched";
            let children = a.children;
            a.removeChild(children[0]);
            a.style.background = "black";
            a.removeEventListener('click', handleCardClick);
        }
    }, 1000);
    selectedCards = [];
}

function foundMatch(array) {
    setTimeout(function () {
        for (let a of array) {
            let children = a.children;
            a.removeChild(children[0]);
        }
    }, 1000);
    selectedCards = [];
}

function newGame(array) {
    currentDeck = array;
    updateLowScore();
    if (checkGameState() === true) {

        let matchedCards = document.querySelectorAll('#matched');
        for (let card of matchedCards) {
            card.remove();
        }
        score = 0;
        let shuffledCards = shuffle(classes);
        dealCards(shuffledCards);
        trackScore();
    } 
}

function updateLowScore() {
    if ((lowScore==0)||(score < lowScore)) {
        localStorage.setItem('low-score', score);
        lowScore = localStorage.getItem('low-score');
    } 
}

function trackScore() {
    const displayedCurrentScore = document.querySelector('#current-score');
    const displayedLowScore = document.querySelector('#low-score');

    displayedCurrentScore.textContent = `Current Score: ${score}`;
    displayedLowScore.textContent = `Score to Beat: ${lowScore}`;
}

function firstGame(array) {
    setLowScore();
    score = 0;
    currentDeck = array;
    let shuffledCards = shuffle(array);
    dealCards(array);
    newGame(array);

    const displayedCurrentScore = document.createElement('h3');
    displayedCurrentScore.id = "current-score"
    displayedCurrentScore.textContent = `Current Score: ${score}`;

    const displayedLowScore = document.createElement('h3');
    displayedLowScore.id = "low-score"
    displayedLowScore.textContent = `Score to Beat: ${lowScore}`;

    const header = document.querySelector('#title');
    header.appendChild(displayedCurrentScore);
    header.appendChild(displayedLowScore);
}

