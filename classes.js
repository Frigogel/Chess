class Piece {

    constructor(row, column, color) {
        this.row = row
        this.column = column
        this.color = color
        this.name = this.constructor.name
        this.hasMoved = false
        const piece = document.createElement('div')
        piece.style.setProperty('height', '100%')
        piece.style.setProperty('background-size', 'cover')
        piece.style.setProperty('background-image', `url(./images/${color}_${this.name}.png)`)
        piece.classList.add('piece')
        this.element = piece
    }
}

class Pawn extends Piece {
    constructor(row, column, color) {
        super(row, column, color)
        this.value = 1
    }

    getPossibleMoves(board, lastMovedPiece) {
        if (lastMovedPiece) lastMovedPiece = lastMovedPiece[0]

        let possibleMoves = []
        let startingRow
        let spaceModifier

        if (this.color === 'white') {
            startingRow = 6
            spaceModifier = -1
        }
        else {
            startingRow = 1
            spaceModifier = 1
        }

        const oneSpaceAhead = board.filter(piece => piece.column === this.column && piece.row === this.row + spaceModifier)[0]
        const twoSpacesAhead = board.filter(piece => piece.column === this.column && piece.row === this.row + 2 * spaceModifier)[0]
        let oneSpaceAheadLeft
        if (this.column !== 0) oneSpaceAheadLeft = board.filter(piece => piece.column === this.column - 1 && piece.row === this.row + spaceModifier)[0]
        let oneSpaceAheadRight = board.filter(piece => piece.column === this.column + 1 && piece.row === this.row + spaceModifier)[0]
        if (this.column !== 7) oneSpaceAheadRight = board.filter(piece => piece.column === this.column + 1 && piece.row === this.row + spaceModifier)[0]

        if (oneSpaceAheadLeft && oneSpaceAheadLeft.color !== this.color) possibleMoves.push([oneSpaceAheadLeft.row, oneSpaceAheadLeft.column])
        if (oneSpaceAheadRight && oneSpaceAheadRight.color !== this.color) possibleMoves.push([oneSpaceAheadRight.row, oneSpaceAheadRight.column])
        if (!oneSpaceAhead) {
            possibleMoves.push([this.row + spaceModifier, this.column])
            if (!twoSpacesAhead && this.row === startingRow) possibleMoves.push([this.row + 2 * spaceModifier, this.column])
        }

        // En passant
        if (lastMovedPiece)
            if (lastMovedPiece.name === 'Pawn' && lastMovedPiece.row === this.row && this.name === 'Pawn' && lastMovedPiece.color !== this.color) {
                // Left
                if (this.column > 0 && lastMovedPiece.column === this.column - 1) {
                    possibleMoves.push([this.row + spaceModifier, this.column - 1, lastMovedPiece])
                }

                // Right
                else if (this.column < 7 && lastMovedPiece.column === this.column + 1) {
                    possibleMoves.push([this.row + spaceModifier, this.column + 1, lastMovedPiece])
                }
            }

        return possibleMoves
    }

    getMoves(board, lastMovedPiece) {
        const possibleMoves = this.getPossibleMoves(board, lastMovedPiece)
        let moves = [...possibleMoves]

        for (let i = 0; i < possibleMoves.length; i++) {

            const startPos = [this.row, this.column]

            this.row = possibleMoves[i][0]
            this.column = possibleMoves[i][1]

            const kill = board.filter(p => p.row === this.row && p.column === this.column && p !== this)[0]

            let tempBoard = [...board]

            if (kill) {
                tempBoard.splice(tempBoard.indexOf(kill), 1)
            }

            if (board.filter(piece => piece.name === 'King' && piece.color === this.color)[0].isChecked(tempBoard))
                moves.splice(moves.indexOf(possibleMoves[i]), 1)

            this.row = startPos[0]
            this.column = startPos[1]
        }

        return moves
    }
}

class Bishop extends Piece {
    constructor(row, column, color) {
        super(row, column, color)
        this.value = 3
    }

    getPossibleMoves(board) {

        let possibleMoves = []

        const directions = [[-1, -1], [-1, 1], [1, 1], [1, -1]]

        for (let i = 0; i < directions.length; i++) {
            let x = this.column + directions[i][1]
            let y = this.row + directions[i][0]

            let piece = board.filter(piece => piece.column === x && piece.row === y)[0]
            while (x >= 0 && x <= 7 && y >= 0 && y <= 7 && !piece) {
                possibleMoves.push([y, x])
                x = x + directions[i][1]
                y = y + directions[i][0]

                piece = board.filter(piece => piece.column === x && piece.row === y)[0]
            }

            // Allow kill if of different color
            if (piece)
                if (piece.color !== this.color) {
                    possibleMoves.push([y, x])
                }
        }

        return possibleMoves
    }

    getMoves(board) {
        const possibleMoves = this.getPossibleMoves(board)
        let moves = [...possibleMoves]

        for (let i = 0; i < possibleMoves.length; i++) {

            const startPos = [this.row, this.column]

            this.row = possibleMoves[i][0]
            this.column = possibleMoves[i][1]

            const kill = board.filter(p => p.row === this.row && p.column === this.column && p !== this)[0]

            let tempBoard = [...board]

            if (kill) {
                tempBoard.splice(tempBoard.indexOf(kill), 1)
            }

            if (board.filter(piece => piece.name === 'King' && piece.color === this.color)[0].isChecked(tempBoard))
                moves.splice(moves.indexOf(possibleMoves[i]), 1)

            this.row = startPos[0]
            this.column = startPos[1]
        }

        return moves
    }
}

class Rook extends Piece {
    constructor(row, column, color) {
        super(row, column, color)
        this.value = 5
    }

    getPossibleMoves(board) {
        let possibleMoves = []

        const directions = [[0, -1], [-1, 0], [0, 1], [1, 0]]

        for (let i = 0; i < directions.length; i++) {

            let x = this.column + directions[i][1]
            let y = this.row + directions[i][0]

            let piece = board.filter(piece => piece.column === x && piece.row === y)[0]
            while (x >= 0 && x <= 7 && y >= 0 && y <= 7 && !piece) {
                possibleMoves.push([y, x])
                x = x + directions[i][1]
                y = y + directions[i][0]

                piece = board.filter(piece => piece.column === x && piece.row === y)[0]
            }

            // Allow kill if of different color
            if (piece)
                if (piece.color !== this.color) {
                    possibleMoves.push([y, x])
                }
        }

        return possibleMoves
    }

    getMoves(board) {
        const possibleMoves = this.getPossibleMoves(board)
        let moves = [...possibleMoves]

        for (let i = 0; i < possibleMoves.length; i++) {

            const startPos = [this.row, this.column]

            this.row = possibleMoves[i][0]
            this.column = possibleMoves[i][1]

            const kill = board.filter(p => p.row === this.row && p.column === this.column && p !== this)[0]

            let tempBoard = [...board]

            if (kill) {
                tempBoard.splice(tempBoard.indexOf(kill), 1)
            }

            if (board.filter(piece => piece.name === 'King' && piece.color === this.color)[0].isChecked(tempBoard))
                moves.splice(moves.indexOf(possibleMoves[i]), 1)

            this.row = startPos[0]
            this.column = startPos[1]
        }

        return moves
    }
}

class Knight extends Piece {
    constructor(row, column, color) {
        super(row, column, color)
        this.value = 3
    }

    getPossibleMoves(board) {
        let possibleMoves = []
        const directions = [[-2, -1], [-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2]]

        for (let i = 0; i < directions.length; i++) {

            let y = this.row + directions[i][0]
            let x = this.column + directions[i][1]
            let piece = board.filter(piece => piece.column === x && piece.row === y)[0]
            if (x < 0 || x > 7 || y < 0 || y > 7) continue
            if (piece) if (piece.color === this.color) continue
            possibleMoves.push([y, x])
        }

        return possibleMoves
    }

    getMoves(board) {
        const possibleMoves = this.getPossibleMoves(board)
        let moves = [...possibleMoves]

        for (let i = 0; i < possibleMoves.length; i++) {

            const startPos = [this.row, this.column]

            this.row = possibleMoves[i][0]
            this.column = possibleMoves[i][1]

            const kill = board.filter(p => p.row === this.row && p.column === this.column && p !== this)[0]

            let tempBoard = [...board]

            if (kill) {
                tempBoard.splice(tempBoard.indexOf(kill), 1)
            }

            if (board.filter(piece => piece.name === 'King' && piece.color === this.color)[0].isChecked(tempBoard))
                moves.splice(moves.indexOf(possibleMoves[i]), 1)

            this.row = startPos[0]
            this.column = startPos[1]
        }

        return moves
    }
}

class Queen extends Piece {
    constructor(row, column, color) {
        super(row, column, color)
        this.value = 9
    }

    getPossibleMoves(board) {
        let possibleMoves = []

        const directions = [[0, -1], [-1, 0], [0, 1], [1, 0], [-1, -1], [-1, 1], [1, 1], [1, -1]]

        for (let i = 0; i < directions.length; i++) {

            let x = this.column + directions[i][1]
            let y = this.row + directions[i][0]

            let piece = board.filter(piece => piece.column === x && piece.row === y)[0]

            while (x >= 0 && x <= 7 && y >= 0 && y <= 7 && !piece) {

                possibleMoves.push([y, x])
                x = x + directions[i][1]
                y = y + directions[i][0]

                piece = board.filter(piece => piece.column === x && piece.row === y)[0]
            }

            // Allow kill if of different color
            if (piece)
                if (piece.color !== this.color) {
                    possibleMoves.push([y, x])
                }
        }

        return possibleMoves
    }

    getMoves(board) {
        const possibleMoves = this.getPossibleMoves(board)
        let moves = [...possibleMoves]

        for (let i = 0; i < possibleMoves.length; i++) {

            const startPos = [this.row, this.column]

            this.row = possibleMoves[i][0]
            this.column = possibleMoves[i][1]

            const kill = board.filter(p => p.row === this.row && p.column === this.column && p !== this)[0]

            let tempBoard = [...board]

            if (kill) {
                tempBoard.splice(tempBoard.indexOf(kill), 1)
            }

            if (board.filter(piece => piece.name === 'King' && piece.color === this.color)[0].isChecked(tempBoard))
                moves.splice(moves.indexOf(possibleMoves[i]), 1)

            this.row = startPos[0]
            this.column = startPos[1]
        }

        return moves
    }
}

class King extends Piece {
    constructor(row, column, color) {
        super(row, column, color)
        this.value = 0
    }

    getPossibleMoves(board) {
        let possibleMoves = []

        const directions = [[0, -1], [-1, 0], [0, 1], [1, 0], [-1, -1], [-1, 1], [1, 1], [1, -1]]

        for (let i = 0; i < directions.length; i++) {

            const x = this.column + directions[i][1]
            const y = this.row + directions[i][0]
            const piece = board.filter(piece => piece.column === x && piece.row === y)[0]
            if (x < 0 || x > 7 || y < 0 || y > 7) continue
            if (piece) if (piece.color === this.color) continue
            possibleMoves.push([y, x])
        }

        // Castling
        if (!this.hasMoved && !this.isChecked(board)) {

            const rooks = board.filter(piece => piece.name === 'Rook' && piece.color === this.color && !piece.hasMoved);
            for (let i = 0; i < rooks.length; i++) {

                let obstructedPath
                for (let j = 1; j < Math.abs(this.column - rooks[i].column); j++) {
                    if (!obstructedPath)
                        if (rooks[i].column - this.column < 0) obstructedPath = !!board.filter(piece => piece.column === this.column - j && piece.row === this.row)[0]
                        else obstructedPath = !!board.filter(piece => piece.column === this.column + j && piece.row === this.row)[0]

                }
                if (!obstructedPath)
                    if (rooks[i].column === 0) possibleMoves.push([rooks[i].row, Math.ceil((rooks[i].column + this.column) / 2), 'O-O-O'])
                    else possibleMoves.push([rooks[i].row, Math.ceil((rooks[i].column + this.column) / 2), 'O-O'])

            }
        }

        return possibleMoves
    }

    getMoves(board) {
        const possibleMoves = this.getPossibleMoves(board)
        let moves = [...possibleMoves]

        for (let i = 0; i < possibleMoves.length; i++) {

            const startPos = [this.row, this.column]

            this.row = possibleMoves[i][0]
            this.column = possibleMoves[i][1]

            const kill = board.filter(p => p.row === this.row && p.column === this.column && p !== this)[0]

            let tempBoard = [...board]

            if (kill) {
                tempBoard.splice(tempBoard.indexOf(kill), 1)
            }

            if (board.filter(piece => piece.name === 'King' && piece.color === this.color)[0].isChecked(tempBoard))
                moves.splice(moves.indexOf(possibleMoves[i]), 1)

            this.row = startPos[0]
            this.column = startPos[1]
        }


        // Prevent Kings from touching
        const enemyKingMoves = board.filter(p => p.name === 'King' && p.color !== this.color)[0].getPossibleMoves(board).map(move => move.toString())

        const tempMoves = [...moves]

        for (let i=0; i<tempMoves.length; i++) {
            const move = tempMoves[i]
            if (enemyKingMoves.includes(move.toString())) moves.splice(moves.indexOf(move), 1)
        }

        return moves
    }

    isChecked(board) {

        const enemyPieces = board.filter(piece => piece.color !== this.color && piece.name !== 'King')

        for (let i = 0; i < enemyPieces.length; i++) {

            const piece = enemyPieces[i]
            const moves = piece.getPossibleMoves(board)

            for (let move = 0; move < moves.length; move++) {
                if (this.row === moves[move][0] && this.column === moves[move][1]) {
                    return true
                }
            }

        }

        return false

    }
}

export { Pawn, King, Queen, Rook, Bishop, Knight, Piece }
