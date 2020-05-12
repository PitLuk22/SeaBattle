let img = document.querySelector('.win');
let field = document.querySelectorAll('td');
let mimo = new Audio('audio/mimo.mp3');
let popal = new Audio('audio/popal.mp3');
let win = new Audio('audio/win.mp3');
let killed = new Audio('audio/killed.mp3');
let runningString = document.querySelector('.string');

let view = {
    displayMessage: function(message) {
        let messageArea = document.querySelector('.messageArea');
        messageArea.innerHTML = message;
    },
    displayHit: function(location) {
        let cell = document.getElementById(location);
        cell.setAttribute('class', 'hit');
    },
    displayMiss: function(location) {
        let cell = document.getElementById(location);
        cell.setAttribute('class', 'miss');
    }
};

let model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [
        {locations: [0,0,0], hits: ['', '', '']},
        {locations: [0,0,0], hits: ['', '', '']},
        {locations: [0,0,0], hits: ['', '', '']},
    ],

    fire: function(guess) {     // в guess мы передаем координаты Например "16"
        for (let i = 0; i < this.numShips; i++) {  // или можно i < this.ships.length;
            let ship = this.ships[i];        //определенный корабля 
            let locations = ship.locations;  //здесь массив координат корабля 
            let index = locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = 'hit';
                view.displayHit(guess); // передаем координаты попадания
                view.displayMessage("Есть пробитие!");
                popal.play();
                if (this.isSunk(ship)) {
                    view.displayMessage("Ты потопил мой корабль!");
                    this.shipsSunk++;
                    setTimeout(function() {
                        killed.play();
                    }, 1000);
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("Мазила!");
        mimo.play();
        return false;
    },

    isSunk: function(ship) { // в ship передается объект корабля 
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },
    generateShipLocations: function() { 
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } 
            while (this.collision(locations)); 
            this.ships[i].locations = locations;
        } 
    },
    generateShip: function() {
        let direction = Math.floor(Math.random() * 2);
        let row, col;
        if (direction == 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength)); 
            col = Math.floor(Math.random() * this.boardSize);
        }
        let newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction == 1) {
                newShipLocations.push(`${row}${col+i}`);
            } else {
                newShipLocations.push(`${row+i}${col}`);
            }
        }
        // tests(newShipLocations);
        return newShipLocations;
    },
    collision: function(locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) { 
                    return true;
                } 
            }
        }
        return false; 
    }
};

let controller = {
    guesses: 0, // количество выстрелов 
    processGuess: function(guess) { //получает координаты в виде A0
        let location = parseGuess(guess);
        if (location) {
            this.guesses++;
            let hit = model.fire(location); //Затем комбинация строки и столбца передается методу fire. Напомним, что метод fire возвращает true при попадании в корабль.
            if (hit == true && model.shipsSunk == model.numShips) {
                view.displayMessage('Победа! Ты потопил все коробли за ' + this.guesses + ' выстрелов!');
                img.classList.remove('hide');
                setTimeout(function() {
                    win.play();
                    runningString.classList.remove('hide');
                }, 2000)
            }
        }
    }
};
console.log(controller.guesses);
//В функцию даются координаты с инпута, а возвращаются лиюо координаты в виде цифр 00, либо null
function parseGuess (guess) {
    let alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    
    if (guess == null || guess.length !== 2) {
        view.displayMessage('Введи нормальные координаты!');
        //Oops, please enter a letter and a number on the board
    } else {
        firstChar = guess.charAt(0).toUpperCase();  // извлекаем первый символ строки
        let row;
        let column;
        if (!isNaN(firstChar)) {
            row = firstChar;
            column = guess.charAt(1);
        } else {
            row = alphabet.indexOf(firstChar);
            column = guess.charAt(1);
        }
        if (isNaN(row) || isNaN(column)) {
            view.displayMessage("Вводи числа, дурачок!");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            view.displayMessage("Ну ты по полю то хоть попади!");
        } else {
            return row + column;
        }
    }
    return null;
}

function init() {
    let fireButton = document.querySelector('#fireButton');
    fireButton.addEventListener('click', handleFireButton);
    var guessInput = document.getElementById("guessInput"); 
    guessInput.onkeypress = handleKeyPress;
    model.generateShipLocations();
    field.forEach((elem) => {
        elem.addEventListener('click', touch);
    });
}

function handleFireButton () {
    let guessInput = document.querySelector("#guessInput");
    let guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
}
 
function handleKeyPress(e) {
    let fireButton = document.getElementById("fireButton"); 
    if (e.keyCode === 13) {
        fireButton.click();
        return false; 
    }
}
// функция по нажатию на поле 
function touch(event) {
    let fireButton = document.getElementById("fireButton"); 
    let guessInput = document.querySelector("#guessInput");
    if (event.target && event.target.classList.contains('squere')) {
        guessInput.value = event.target.id;
        fireButton.click();
        return false;
    }
}
window.onload = init; //браузер должен выполнять init при полной загрузке страницы


$(function() {
	var marquee = $(".marquee"); 
	marquee.css({"overflow": "hidden", "width": "100%"});
	// оболочка для текста ввиде span (IE не любит дивы с inline-block)
	marquee.wrapInner("<span>");
	marquee.find("span").css({ "width": "50%", "display": "inline-block", "text-align":"center" }); 
	marquee.append(marquee.find("span").clone()); // тут у нас два span с текстом
	marquee.wrapInner("<div>");
	marquee.find("div").css("width", "200%");
	var reset = function() {
		$(this).css("margin-left", "0%");
		$(this).animate({ "margin-left": "-100%" }, 12000, 'linear', reset);
	};
	reset.call(marquee.find("div"));
});


//Tests

// tests();
// controller.processGuess("G2");
// controller.processGuess("G3"); 
// controller.processGuess("G4"); 
// controller.processGuess("A1");
// controller.processGuess("A2"); 
// controller.processGuess("A3"); 
// controller.processGuess("E1");
// controller.processGuess("D1"); 
// controller.processGuess("F1"); 
// controller.processGuess("B2");

// console.log(parseGuess("A0")); 
// console.log(parseGuess("B6")); 
// console.log(parseGuess("G3")); 
// parseGuess("H0"); 
// console.log(parseGuess("A7"));

// view.displayMiss("00"); 
// view.displayHit("34"); 
// view.displayMiss("55"); 
// view.displayHit("12"); 
// view.displayMiss("25");
// view.displayHit("26");
// view.displayMessage("Tap tap, is this thing on?");

// model.fire("53");
// model.fire("06"); model.fire("16"); model.fire("26");
// model.fire("34"); model.fire("24"); model.fire("44");
// model.fire("12"); model.fire("11"); model.fire("10");