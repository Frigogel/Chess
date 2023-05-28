import { Pawn, King, Queen, Rook, Bishop, Knight } from './classes.js'

const chessContainer = document.querySelector('.chess')
chessContainer.style.setProperty('position', 'relative')
chessContainer.style.setProperty('display', 'inline-block')

let createBoard = () => {
    let size = chessContainer.getAttribute('size')
    if (size === 'auto') {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        if (screenHeight < screenWidth) size = screenHeight.toString() + 'px'
        else size = screenWidth.toString() + 'px'
    }
    console.log(size)
    let textContent = '<table style="border-collapse: collapse; border: 2px solid black; background: rgb(238,238,210);">'
    for (let i = 0; i < 8; i++) {
        textContent += `<tr>`
        for (let j = 0; j < 8; j++) {
            textContent += `<th style="padding: 0;height: calc(${size}/8); width: calc(${size}/8); ${(i % 2 === 0 && j % 2 === 1) || (i % 2 === 1 && j % 2 === 0) ? 'background: rgb(118,150,86)' : ''}; position: relative"></th>`
        }
        textContent += '</tr>'
    }
    textContent += '</table>'
    return textContent
}

let createChessBoard = () => {
    return [
        new Rook(0, 0, 'black'), new Knight(0, 1, 'black'), new Bishop(0, 2, 'black'), new Queen(0, 3, 'black'), new King(0, 4, 'black'), new Bishop(0, 5, 'black'), new Knight(0, 6, 'black'), new Rook(0, 7, 'black'),
        new Pawn(1, 0, 'black'), new Pawn(1, 1, 'black'), new Pawn(1, 2, 'black'), new Pawn(1, 3, 'black'), new Pawn(1, 4, 'black'), new Pawn(1, 5, 'black'), new Pawn(1, 6, 'black'), new Pawn(1, 7, 'black'),
        new Pawn(6, 0, 'white'), new Pawn(6, 1, 'white'), new Pawn(6, 2, 'white'), new Pawn(6, 3, 'white'), new Pawn(6, 4, 'white'), new Pawn(6, 5, 'white'), new Pawn(6, 6, 'white'), new Pawn(6, 7, 'white'),
        new Rook(7, 0, 'white'), new Knight(7, 1, 'white'), new Bishop(7, 2, 'white'), new Queen(7, 3, 'white'), new King(7, 4, 'white'), new Bishop(7, 5, 'white'), new Knight(7, 6, 'white'), new Rook(7, 7, 'white')
    ]
}

let updatePosition = (piece) => {

    piece.hasMoved = true

    const th = document.querySelector(`.chess tr:nth-child(${piece.row + 1}) th:nth-child(${piece.column + 1})`)

    const kill = chessBoard.filter(p => p.row === piece.row && p.column === piece.column && p !== piece)[0]

    if (kill) {
        chessBoard.splice(chessBoard.indexOf(kill), 1)
        th.firstChild.remove()
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
            for (let child = 0; child < possibleMoveElements.length; child++) {
                possibleMoveElements[child].remove()
            }

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

                    lastMovedPieces.push([piece, piece.row, piece.column])

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
                            chessBoard.splice(chessBoard.indexOf(kill), 1)
                            kill.element.remove()
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
                        else playerWins(undefined, true)
                    }

                    // Insufficient material
                    const whitePieces = chessBoard.filter(p => p.color === 'white').sort((a,b) => a.value - b.value)
                    const blackPieces = chessBoard.filter(p => p.color === 'black').sort((a,b) => a.value - b.value)
                    // King vs King
                    if (whitePieces.length === 1 && blackPieces.length === 1) playerWins(undefined, true)
                    // King vs King + Minor Piece
                    if (whitePieces.length === 2 && blackPieces.length === 1 && whitePieces[1].value === 3) playerWins(undefined, true)
                    if (blackPieces.length === 2 && whitePieces.length === 1 && blackPieces[1].value === 3) playerWins(undefined, true)
                    // King vs King + 2 Knights
                    if (whitePieces.length === 3 && blackPieces.length === 1 && whitePieces[1].name === 'Knight' && whitePieces[2].name === 'Knight') playerWins(undefined, true)
                    if (blackPieces.length === 3 && whitePieces.length === 1 && blackPieces[1].name === 'Knight' && blackPieces[2].name === 'Knight') playerWins(undefined, true)
                    // King + Minor Piece vs King + Minor Piece
                    if (whitePieces.length === 2 && blackPieces.length === 2 && whitePieces[1].value === 3 && blackPieces[1].value) playerWins(undefined, true)

                    // Repetition
                    const lastNineMoves = lastMovedPieces.slice(-9).map(move => [move[0],move.slice(-2).toString()])
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
                        ) playerWins(undefined, true)

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
    winScreen.style.setProperty('background', 'blue')
    winScreen.style.setProperty('width', '50%')
    winScreen.style.setProperty('height', '40%')
    winScreen.style.setProperty('transform', 'translate(-50%,-50%)')
    winScreen.style.setProperty('display', 'flex')
    winScreen.style.setProperty('align-items', 'center')
    winScreen.style.setProperty('justify-content', 'center')
    winScreen.style.setProperty('overflow', 'hidden')
    winScreen.style.setProperty('flex-direction', 'column')
    if (draw) {
        winScreen.innerText = 'Draw!'
    }
    else winScreen.innerText = `${winner.charAt(0).toUpperCase() + winner.slice(1)} wins!`
    winScreen.style.setProperty('font-size', '20px')
    winScreen.style.setProperty('white-space', 'nowrap')

    const resetButton = document.createElement('button')
    resetButton.style.setProperty('padding', '1rem')
    resetButton.style.setProperty('margin-top', '.5rem')
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
        newTurn()
    })

    winScreen.appendChild(resetButton)
}

chessContainer.innerHTML = createBoard()

let chessBoard = createChessBoard()

for (let i = 0; i < chessBoard.length; i++) {

    const th = document.querySelector(`.chess tr:nth-child(${chessBoard[i].row + 1}) th:nth-child(${chessBoard[i].column + 1})`)

    th.appendChild(chessBoard[i].element)
}

let turn = 'black'
let lastMovedPieces = []

newTurn()
