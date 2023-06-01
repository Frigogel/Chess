import { Pawn, King, Queen, Rook, Bishop, Knight } from './classes.js'

const chessContainer = document.querySelector('.chess')
chessContainer.style.setProperty('position', 'relative')
chessContainer.style.setProperty('display', 'inline-block')
chessContainer.style.setProperty('perspective', '100px')
chessContainer.style.setProperty('transform-style', 'preserve-3d')

function extractRotationAngle(matrix) {
    const match = matrix.match(/matrix\((.+)\)/);
    if (match) {
        const values = match[1].split(",");
        const a = parseFloat(values[0]);
        const b = parseFloat(values[1]);
        return Math.round(Math.atan2(b, a) * (180 / Math.PI));
    }
    return 0;
}

let createChessBoard = () => {
    return [
        new Rook(0, 0, 'black'), new Knight(0, 1, 'black'), new Bishop(0, 2, 'black'), new Queen(0, 3, 'black'), new King(0, 4, 'black'), new Bishop(0, 5, 'black'), new Knight(0, 6, 'black'), new Rook(0, 7, 'black'),
        new Pawn(1, 0, 'black'), new Pawn(1, 1, 'black'), new Pawn(1, 2, 'black'), new Pawn(1, 3, 'black'), new Pawn(1, 4, 'black'), new Pawn(1, 5, 'black'), new Pawn(1, 6, 'black'), new Pawn(1, 7, 'black'),
        new Pawn(6, 0, 'white'), new Pawn(6, 1, 'white'), new Pawn(6, 2, 'white'), new Pawn(6, 3, 'white'), new Pawn(6, 4, 'white'), new Pawn(6, 5, 'white'), new Pawn(6, 6, 'white'), new Pawn(6, 7, 'white'),
        new Rook(7, 0, 'white'), new Knight(7, 1, 'white'), new Bishop(7, 2, 'white'), new Queen(7, 3, 'white'), new King(7, 4, 'white'), new Bishop(7, 5, 'white'), new Knight(7, 6, 'white'), new Rook(7, 7, 'white')
    ]
}

let killPiece = (piece) => {
    const currentScore = document.querySelector('.score')
    if (currentScore) currentScore.remove()
    chessBoard.splice(chessBoard.indexOf(piece), 1)
    piece.element.style.setProperty('aspect-ratio', '1')
    piece.element.style.setProperty('transform', 'rotate(0deg)')
    if (piece.color === 'white') {
        whiteGraveyard.appendChild(piece.element)
        blackScore += piece.value
    }
    else {
        blackGraveyard.appendChild(piece.element)
        whiteScore += piece.value
    }
    const score = document.createElement('h2')
    score.style.setProperty('color', 'rgb(200,200,200)')
    score.style.setProperty('margin', '0')
    score.style.setProperty('font-size', `calc(${size}*0.03)`)
    score.style.setProperty('text-align', 'center')
    score.classList.add('score')
    if (whiteScore > blackScore) {
        score.innerText = '+' + (whiteScore - blackScore)
        blackGraveyard.appendChild(score)
    }
    else if (blackScore > whiteScore) {
        score.innerText = '+' + (blackScore - whiteScore)
        whiteGraveyard.appendChild(score)
    }
    console.log(whiteScore, blackScore)
    lastKill = 0
}

let updatePosition = (piece) => {

    piece.hasMoved = true

    const th = document.querySelector(`.chess tr:nth-child(${piece.row + 1}) th:nth-child(${piece.column + 1})`)

    const kill = chessBoard.filter(p => p.row === piece.row && p.column === piece.column && p !== piece)[0]

    if (kill) {
        killPiece(kill)
    }

    th.appendChild(piece.element)
}

function newTurn() {

    const oldPieceListeners = document.querySelectorAll('.chess .pieceEventListener')
    oldPieceListeners.forEach(e => e.remove())

    if (turn === 'white') turn = 'black'
    else turn = 'white'

    const movablePieces = chessBoard.filter(piece => piece.color === turn)

    for (let i = 0; i < movablePieces.length; i++) {
        const pieceListener = document.createElement('div')
        pieceListener.classList.add('pieceEventListener')
        pieceListener.style.setProperty('height', '100%')
        pieceListener.style.setProperty('width', '100%')
        pieceListener.style.setProperty('position', 'absolute')
        pieceListener.style.setProperty('top', '0')

        movablePieces[i].element.appendChild(pieceListener)

        pieceListener.addEventListener('click', (e) => {

            // Remove Previous Moves
            const piece = movablePieces[i]

            const possibleMoveElements = document.querySelectorAll('.chess .possible-move')
            possibleMoveElements.forEach(e => e.remove())
            const moveEventListeners = document.querySelectorAll('.chess .moveEventListener')
            moveEventListeners.forEach(e => e.remove())

            // Add curent moves
            const moves = piece.getMoves(chessBoard, lastMovedPieces[lastMovedPieces.length - 1])
            for (let move = 0; move < moves.length; move++) {
                const th = document.querySelector(`.chess tr:nth-child(${moves[move][0] + 1}) th:nth-child(${moves[move][1] + 1})`)

                const possibleMoveElement = document.createElement('div')
                possibleMoveElement.classList.add('possible-move')
                possibleMoveElement.style.setProperty('position', 'absolute')
                possibleMoveElement.style.setProperty('top', '50%')
                possibleMoveElement.style.setProperty('left', '50%')
                possibleMoveElement.style.setProperty('width', '75%')
                possibleMoveElement.style.setProperty('height', '75%')
                possibleMoveElement.style.setProperty('transform', 'translate(-50%, -50%)')
                possibleMoveElement.style.setProperty('background', 'rgb(0,0,0, 0.5)')
                possibleMoveElement.style.setProperty('border-radius', '50%')

                th.appendChild(possibleMoveElement);

                const moveListener = document.createElement('div')
                moveListener.classList.add('moveEventListener')
                moveListener.style.setProperty('height', '100%')
                moveListener.style.setProperty('width', '100%')
                moveListener.style.setProperty('position', 'absolute')
                moveListener.style.setProperty('top', '0')

                th.appendChild(moveListener)

                moveListener.addEventListener('click', () => {

                    settings.remove()
                    settingsImage.remove()

                    // Timer
                    if (timerCheckboxInput.checked) {
                        if (piece.color === 'white') {
                            stopTimerWhite()
                            startTimerBlack()
                        }
                        else {
                            stopTimerBlack()
                            startTimerWhite()
                        }
                    }

                    lastMovedPieces.push([piece, piece.row, piece.column])
                    lastKill++

                    piece.row = moves[move][0];
                    piece.column = moves[move][1];
                    updatePosition(piece);
                    const moveEventListeners = document.querySelectorAll('.chess .moveEventListener');
                    const moveElements = document.querySelectorAll('.chess .possible-move')
                    moveEventListeners.forEach(e => e.remove())
                    moveElements.forEach(e => e.remove())

                    // Castle + En passant
                    if (moves[move].length === 3) {
                        if (moves[move][2] === 'O-O') {
                            const rook = chessBoard.filter(p => p.row === piece.row && p.column === 7)[0]
                            rook.column = 5
                            updatePosition(rook)
                        }
                        else if (moves[move] === 'O-O-O') {
                            const rook = chessBoard.filter(p => p.row === piece.row && p.column === 0)[0]
                            rook.column = 3
                            updatePosition(rook)
                        }
                        else {
                            const kill = moves[move][2]
                            killPiece(kill)
                        }
                    }

                    // Pawn Promotion
                    if (piece.name === 'Pawn')

                        if ((piece.color === 'white' && piece.row === 0) || (piece.color === 'black' && piece.row === 7)) {

                            const promotionContainer = document.createElement('div');
                            chessContainer.appendChild(promotionContainer);

                            const th = document.querySelector('.chess th');

                            const possiblePromotions = [
                                new Queen(piece.row, piece.column, piece.color),
                                new Bishop(piece.row, piece.column, piece.color),
                                new Knight(piece.row, piece.column, piece.color),
                                new Rook(piece.row, piece.column, piece.color)
                            ]

                            for (let i = 0; i < 4; i++) {
                                const newPiece = possiblePromotions[i]
                                promotionContainer.append(newPiece.element)

                                newPiece.element.style.setProperty('width', `${th.offsetWidth}px`)
                                newPiece.element.style.setProperty('height', `${th.offsetHeight}px`)
                                // newPiece.element.style.setProperty('border', `2px solid black`)

                                // Promotion Piece Selected CLick Listener
                                newPiece.element.addEventListener('click', () => {

                                    piece.element.remove()

                                    chessBoard.splice(chessBoard.indexOf(piece), 1)
                                    chessBoard.push(newPiece)
                                    promotionContainer.remove()

                                    updatePosition(newPiece)

                                })

                            }

                            promotionContainer.style.setProperty('position', 'absolute')
                            promotionContainer.style.setProperty('background', 'blue')
                            if (piece.color === 'white')
                                promotionContainer.style.setProperty('top', '5%')
                            if (piece.color === 'black')
                                promotionContainer.style.setProperty('bottom', '5%')
                            promotionContainer.style.setProperty('left', `${Math.round(chessContainer.offsetWidth / 7 * piece.column)}px`)
                        }

                    // Check
                    if (chessBoard.filter(p => p.color !== piece.color).every(p => p.getMoves(chessBoard).length === 0)) {
                        // Checkmate
                        if (chessBoard.filter(p => p.name === 'King' && p.color !== piece.color)[0].isChecked(chessBoard))
                            playerWins(turn)
                        // Stalemate
                        else playerWins(undefined, 'Stalemate')
                    }

                    // Insufficient material
                    const whitePieces = chessBoard.filter(p => p.color === 'white').sort((a, b) => a.value - b.value)
                    const blackPieces = chessBoard.filter(p => p.color === 'black').sort((a, b) => a.value - b.value)
                    // King vs King
                    if (whitePieces.length === 1 && blackPieces.length === 1) playerWins(undefined, 'Insufficient material')
                    // King vs King + Minor Piece
                    if (whitePieces.length === 2 && blackPieces.length === 1 && whitePieces[1].value === 3) playerWins(undefined, 'Insufficient material')
                    if (blackPieces.length === 2 && whitePieces.length === 1 && blackPieces[1].value === 3) playerWins(undefined, 'Insufficient material')
                    // King vs King + 2 Knights
                    if (whitePieces.length === 3 && blackPieces.length === 1 && whitePieces[1].name === 'Knight' && whitePieces[2].name === 'Knight') playerWins(undefined, 'Insufficient material')
                    if (blackPieces.length === 3 && whitePieces.length === 1 && blackPieces[1].name === 'Knight' && blackPieces[2].name === 'Knight') playerWins(undefined, 'Insufficient material')
                    // King + Minor Piece vs King + Minor Piece
                    if (whitePieces.length === 2 && blackPieces.length === 2 && whitePieces[1].value === 3 && blackPieces[1].value) playerWins(undefined, 'Insufficient material')

                    // Repetition
                    const lastNineMoves = lastMovedPieces.slice(-9).map(move => [move[0], move.slice(-2).toString()])
                    if (lastNineMoves.length === 9)
                        if (
                            lastNineMoves[0][0] === lastNineMoves[4][0] && lastNineMoves[4][0] === lastNineMoves[8][0] &&
                            lastNineMoves[1][0] === lastNineMoves[5][0] &&
                            lastNineMoves[2][0] === lastNineMoves[6][0] &&
                            lastNineMoves[3][0] === lastNineMoves[7][0] &&
                            lastNineMoves[0][1] === lastNineMoves[4][1] && lastNineMoves[4][1] === lastNineMoves[8][1] &&
                            lastNineMoves[1][1] === lastNineMoves[5][1] &&
                            lastNineMoves[2][1] === lastNineMoves[6][1] &&
                            lastNineMoves[3][1] === lastNineMoves[7][1]
                        ) playerWins(undefined, 'Repetition')

                    // 50 move rule
                    let pawnedMoved = false
                    if (lastMovedPieces[lastMovedPieces.length - 1][0].name === 'Pawn') {
                        pawnedMoved = true
                        lastKill = 0
                    }

                    if (lastKill === 50 && !pawnedMoved) playerWins(undefined, '50 move rule')

                    // Rotate Pieces
                    const computedStyle = getComputedStyle(piece.element)
                    const currentRotation = computedStyle.transform
                    const currentAngle = extractRotationAngle(currentRotation);

                    const newAngle = currentAngle + 180

                    const availablePieces = document.querySelectorAll('.chess table .piece');
                    availablePieces.forEach(e => e.style.setProperty('transform', `rotate(${newAngle}deg)`))


                    if (rotateCheckboxInput.checked) {
                        chessContainer.style.setProperty('transform', `rotate(${newAngle}deg)`)
                        whiteGraveyard.style.setProperty('transform', `rotateX(${newAngle}deg)`)
                        blackGraveyard.style.setProperty('transform', `rotateX(${newAngle}deg)`)
                        if (timerCheckboxInput.checked) {
                            whiteTimer.style.setProperty('transform', `rotateX(-${newAngle}deg)`)
                            blackTimer.style.setProperty('transform', `rotateX(-${newAngle}deg)`)
                        }

                    } else {
                        if (timerCheckboxInput.checked) {
                            whiteTimer.style.setProperty('transform', `rotate(-${newAngle}deg)`)
                            blackTimer.style.setProperty('transform', `rotate(-${newAngle}deg)`)
                        }
                    }

                    newTurn()

                });
            }
        })

    }


}

function playerWins(winner, draw = false) {
    const winScreen = document.createElement('div')
    chessContainer.appendChild(winScreen)
    winScreen.style.setProperty('position', 'absolute')
    winScreen.style.setProperty('top', '50%')
    winScreen.style.setProperty('left', '50%')
    winScreen.style.setProperty('background', 'rgb(85,85,85)')
    winScreen.style.setProperty('color', 'white')
    winScreen.style.setProperty('border-radius', '10%')
    winScreen.style.setProperty('width', '50%')
    winScreen.style.setProperty('height', '40%')
    winScreen.style.setProperty('transform', 'translate(-50%,-50%)')
    winScreen.style.setProperty('display', 'flex')
    winScreen.style.setProperty('align-items', 'center')
    winScreen.style.setProperty('justify-content', 'center')
    winScreen.style.setProperty('overflow', 'hidden')
    winScreen.style.setProperty('flex-direction', 'column')
    winScreen.style.setProperty('white-space', 'nowrap')

    const winScreenText = document.createElement('div')
    winScreenText.style.setProperty('font-size', `calc(${size}/20)`)
    winScreen.appendChild(winScreenText)

    if (draw) {
        winScreenText.innerText = `Draw by : ${draw}`
    }
    else winScreenText.innerText = `${winner.charAt(0).toUpperCase() + winner.slice(1)} wins!`

    const resetButton = document.createElement('button')
    resetButton.style.setProperty('padding', '.5rem')
    resetButton.style.setProperty('margin-top', '.5rem')
    resetButton.style.setProperty('border-radius', '10%')
    resetButton.style.setProperty('background', 'rgb(85,85,85)')
    resetButton.style.setProperty('border', '5px solid white')
    resetButton.style.setProperty('color', 'white')
    resetButton.style.setProperty('font-size', `calc(${size}/25)`)
    resetButton.innerText = 'Reset'
    resetButton.addEventListener('click', () => {
        winScreen.remove()

        const pieces = document.querySelectorAll('.chess .piece')
        pieces.forEach(e => e.remove())

        chessBoard = createChessBoard()
        for (let i = 0; i < chessBoard.length; i++) {

            const th = document.querySelector(`.chess tr:nth-child(${chessBoard[i].row + 1}) th:nth-child(${chessBoard[i].column + 1})`)

            th.appendChild(chessBoard[i].element)
        }

        turn = 'black'

        const availablePieces = document.querySelectorAll('.chess table .piece');
        availablePieces.forEach(e => e.style.setProperty('transform', `rotate(0deg)`))


        chessContainer.style.setProperty('transform', `rotate(0deg)`)
        whiteGraveyard.style.setProperty('transform', `rotate(0deg)`)
        blackGraveyard.style.setProperty('transform', `rotate(0deg)`)

        newTurn()
    })

    winScreen.appendChild(resetButton)
}


let size = chessContainer.getAttribute('size')
if (size.includes('fill')) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    if (screenHeight < screenWidth) size = `calc(${size.replace('fill', screenHeight.toString() + 'px')}*0.9)`
    else size = size.replace('fill', screenWidth.toString() + 'px')
}
const newBoard = () => {
    const table = document.createElement('table')
    table.style.setProperty('border-collapse', 'collapse')
    table.style.setProperty('border', '2px solid black')
    table.style.setProperty('background', 'rgb(238,238,210)')
    for (let i = 0; i < 8; i++) {
        const tr = document.createElement('tr')
        for (let j = 0; j < 8; j++) {
            const th = document.createElement('th')
            th.style.setProperty('padding', '0')
            th.style.setProperty('height', `calc(calc(${size}/8))`)
            th.style.setProperty('width', `calc(calc(${size}/8))`)
            th.style.setProperty('position', 'relative')
            if ((i % 2 === 0 && j % 2 === 1) || (i % 2 === 1 && j % 2 === 0)) th.style.setProperty('background', 'rgb(118,150,86)')
            tr.appendChild(th)
        }
        table.appendChild(tr)
        chessContainer.appendChild(table)
    }
}


const topSidebar = document.createElement('div')
topSidebar.style.setProperty('height', `calc(${size}*0.05)`)
topSidebar.style.setProperty('background', 'rgb(40,40,40)')
topSidebar.style.setProperty('display', 'flex')
const bottomSidebar = document.createElement('div')
bottomSidebar.style.setProperty('height', `calc(${size}*0.05)`)
bottomSidebar.style.setProperty('background', 'rgb(40,40,40)')
bottomSidebar.style.setProperty('display', 'flex')

chessContainer.appendChild(topSidebar)
newBoard()
chessContainer.append(bottomSidebar)


const settingsImage = document.createElement('div')
settingsImage.style.setProperty('background-image', 'url(./images/settings.png)')
settingsImage.style.setProperty('height', `calc(${size}*0.05)`)
settingsImage.style.setProperty('width', `calc(${size}*0.05)`)
settingsImage.style.setProperty('position', 'absolute')
settingsImage.style.setProperty('background-size', 'cover')
settingsImage.style.setProperty('transform', 'translateZ(0)')

const settings = document.createElement('div')
settings.classList.add('settings')
settings.style.setProperty('padding-bottom', `calc(${size}*0.05)`)
settings.style.setProperty('width', `calc(${size}/4)`)
settings.style.setProperty('position', 'absolute')
settings.style.setProperty('top', `calc(${size}*0.05)`)
settings.style.setProperty('left', '0')
settings.style.setProperty('z-index', '1')
settings.style.setProperty('font-size', `calc(${size}/30)`)
settings.style.setProperty('color', 'rgb(200,200,200)')
settings.style.setProperty('display', 'none')

topSidebar.appendChild(settingsImage)
topSidebar.appendChild(settings)

const rotateCheckboxContainer = document.createElement('div')
rotateCheckboxContainer.style.setProperty('margin-top', '10%')
rotateCheckboxContainer.style.setProperty('display', 'flex');
rotateCheckboxContainer.style.setProperty('align-items', 'center');

const rotateCheckboxInput = document.createElement('input');
rotateCheckboxInput.type = 'checkbox'
rotateCheckboxInput.id = 'rotate-checkbox'
rotateCheckboxInput.style.setProperty('height', `calc(${size}*0.025)`)
rotateCheckboxInput.style.setProperty('aspect-ratio', '1')

const rotateLabel = document.createElement("label");
rotateLabel.setAttribute("for", "rotate-checkbox");
rotateLabel.textContent = "Board rotates";

rotateCheckboxContainer.appendChild(rotateCheckboxInput)
rotateCheckboxContainer.appendChild(rotateLabel)

const timerCheckboxContainer = document.createElement('div');
timerCheckboxContainer.style.setProperty('margin-top', '10%');
timerCheckboxContainer.style.setProperty('display', 'flex');
timerCheckboxContainer.style.setProperty('align-items', 'center');

const timerCheckboxInput = document.createElement('input');
timerCheckboxInput.type = 'checkbox';
timerCheckboxInput.id = 'timer-checkbox';
timerCheckboxInput.style.setProperty('height', `calc(${size}*0.025)`)
timerCheckboxInput.style.setProperty('aspect-ratio', '1')

let timerIntervalWhite;
let timerIntervalBlack;
let whiteTimer;
let blackTimer;
let secondsWhite;
let secondsBlack;

function updateSelectedDuration() {
    const minutes = durationSlider.value;
    selectedDuration.textContent = `${minutes} minute${minutes > 1 ? 's' : ''}`;
    secondsBlack = minutes * 60
    secondsWhite = minutes * 60
    whiteTimer.textContent = formatTime(secondsWhite)
    blackTimer.textContent = formatTime(secondsBlack)
}

function startTimerWhite() {
    clearInterval(timerIntervalWhite);
    timerIntervalWhite = setInterval(updateTimerWhite, 1000);
}

function stopTimerWhite() {
    clearInterval(timerIntervalWhite);
}

function updateTimerWhite() {
    if (secondsWhite <= 0) {
        clearInterval(timerIntervalWhite);
        playerWins('black')
        return;
    }

    secondsWhite--;
    const formattedTime = formatTime(secondsWhite);
    whiteTimer.textContent = formattedTime;
}

function startTimerBlack() {
    clearInterval(timerIntervalBlack);
    timerIntervalBlack = setInterval(updateTimerBlack, 1000);
}

function stopTimerBlack() {
    clearInterval(timerIntervalBlack);
}

function updateTimerBlack() {
    if (secondsBlack <= 0) {
        clearInterval(timerIntervalBlack);
        playerWins('white')
        return;
    }

    secondsBlack--;
    const formattedTime = formatTime(secondsBlack);
    blackTimer.textContent = formattedTime;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${pad(minutes)}:${pad(remainingSeconds)}`;
}

function pad(value) {
    return String(value).padStart(2, '0');
}

const durationSlider = document.createElement('input');
durationSlider.style.setProperty('width', '80%');
durationSlider.style.setProperty('height', `calc(${size}*0.01)`);
durationSlider.style.setProperty('margin-left', `calc(${size}*0.025)`);
durationSlider.type = 'range';
durationSlider.id = 'durationSlider';
durationSlider.min = '1';
durationSlider.max = '10';
durationSlider.step = '1';

const selectedDuration = document.createElement('span');
selectedDuration.style.setProperty('margin-left', `calc(${size}*0.025)`);
selectedDuration.id = 'selectedDuration';

// const timerContainer = document.querySelector('.chess .settings');


timerCheckboxInput.addEventListener('change', function () {
    if (!this.checked) {
        // const durationSlider = document.querySelector('#durationSlider');
        console.log(durationSlider)
        durationSlider.remove();

        // const selectedDuration = document.querySelector('#selectedDuration');
        selectedDuration.remove();

        stopTimerWhite();
        stopTimerBlack();

        whiteTimer.remove()
        blackTimer.remove()
        return;
    }

    whiteTimer = document.createElement('div');
    whiteTimer.classList.add('white-timer');
    whiteTimer.style.setProperty('position', 'absolute');
    whiteTimer.style.setProperty('bottom', '0');
    whiteTimer.style.setProperty('right', '0');
    whiteTimer.style.setProperty('height', `calc(${size}*0.05)`);
    whiteTimer.style.setProperty('width', `calc(${size}*0.1)`);
    whiteTimer.style.setProperty('background', 'white');
    whiteTimer.style.setProperty('font-size', `calc(${size}*0.04)`);
    whiteTimer.style.setProperty('display', 'flex')
    whiteTimer.style.setProperty('justify-content', 'center')
    whiteTimer.style.setProperty('align-items', 'center')
    whiteTimer.style.setProperty('display', 'flex')


    blackTimer = document.createElement('div');
    blackTimer.classList.add('black-timer');
    blackTimer.style.setProperty('position', 'absolute');
    blackTimer.style.setProperty('top', '0');
    blackTimer.style.setProperty('right', '0');
    blackTimer.style.setProperty('height', `calc(${size}*0.05)`);
    blackTimer.style.setProperty('width', `calc(${size}*0.1)`);
    blackTimer.style.setProperty('background', 'black');
    blackTimer.style.setProperty('color', 'white');
    blackTimer.style.setProperty('font-size', `calc(${size}*0.04)`);
    blackTimer.style.setProperty('display', 'flex')
    blackTimer.style.setProperty('justify-content', 'center')
    blackTimer.style.setProperty('align-items', 'center')


    settings.appendChild(durationSlider);
    settings.appendChild(selectedDuration);

    chessContainer.appendChild(blackTimer);
    chessContainer.appendChild(whiteTimer);

    durationSlider.addEventListener('input', updateSelectedDuration);

    updateSelectedDuration();
});

const timerLabel = document.createElement('label');
timerLabel.setAttribute('for', 'timer-checkbox');
timerLabel.textContent = 'Timer';

timerCheckboxContainer.appendChild(timerCheckboxInput);
timerCheckboxContainer.appendChild(timerLabel);

let settingsOpen = false

settingsImage.addEventListener('click', () => {
    if (!settingsOpen) {
        settings.style.setProperty('background', 'rgb(40,40,40)')
        settings.style.setProperty('display', 'block')
        settings.appendChild(rotateCheckboxContainer)
        settings.appendChild(timerCheckboxContainer)
        if (timerCheckboxInput.checked) {
            settings.appendChild(durationSlider);
            settings.appendChild(selectedDuration);
        }
        settingsOpen = true
        return
    }
    settings.style.setProperty('display', 'none')
    rotateCheckboxContainer.remove()
    timerCheckboxContainer.remove()
    selectedDuration.remove();
    durationSlider.remove();
    settingsOpen = false
})

const whiteGraveyard = document.createElement('div')
whiteGraveyard.style.setProperty('width', '100%')
whiteGraveyard.style.setProperty('margin-left', `calc(${size}*0.1)`)
whiteGraveyard.style.setProperty('display', 'flex')
whiteGraveyard.style.setProperty('align-items', 'center')
topSidebar.appendChild(whiteGraveyard)

const blackGraveyard = document.createElement('div')
blackGraveyard.style.setProperty('width', '100%')
blackGraveyard.style.setProperty('margin-left', `calc(${size}*0.1)`)
blackGraveyard.style.setProperty('display', 'flex')
blackGraveyard.style.setProperty('align-items', 'center')
bottomSidebar.appendChild(blackGraveyard)

let whiteScore = 0
let blackScore = 0


let chessBoard = createChessBoard()

for (let i = 0; i < chessBoard.length; i++) {

    const th = document.querySelector(`.chess tr:nth-child(${chessBoard[i].row + 1}) th:nth-child(${chessBoard[i].column + 1})`)

    th.appendChild(chessBoard[i].element)
}

let turn = 'black'
let lastMovedPieces = []
let lastKill = 0
newTurn()
