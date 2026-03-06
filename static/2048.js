document.addEventListener('DOMContentLoaded', () => {
    const gridDisplay = document.querySelector('.grid')
    const scoreDisplay = document.getElementById('score')
    const resultDisplay = document.getElementById('result')
    const width = 4
    let tiles = []
    let score = 0
    let gamePause = false
    let gameWon = false
    let gameOver = false

    // create tiles
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const tile = document.createElement('div')
            tile.innerHTML = 0
            gridDisplay.appendChild(tile)
            tiles.push(tile)
        }

        generate()
        generate()
    }
    createBoard()

    // event listener for if new game button clicked
    document.getElementById('new-game').onclick = function() {
        newGame()
    }

    window.onload = function() {
        newGame()
    }

    // get a weighted random number between two options
    function weightedRandom(option1, option2, weight1) {
        const randomNumber = Math.random();
        if (randomNumber < weight1) {
            return option1;
        } else {
            return option2;
        }
    }

    // generate new tile
    function generate() {
        const randomTile = Math.floor(Math.random() * tiles.length)
        if (tiles[randomTile].innerHTML == 0) {
            // generates a new tile in a random empty cell (2 or 4, 2 has a 70% probability)
            tiles[randomTile].innerHTML = weightedRandom(2, 4, 0.7)

            // check for game over

        } else generate()
    }

    function moveRight() {
        for (let i = 0; i < width * width; i++) {
            // finds the tiles in column 0
            if (i % width === 0) { // beginning of each row (0, 4, 8, 12)
                let colZero = tiles[i].innerHTML // column zero of that row
                let colOne = tiles[i+1].innerHTML
                let colTwo = tiles[i+2].innerHTML
                let colThree = tiles[i+3].innerHTML
                let row = [parseInt(colZero), parseInt(colOne), parseInt(colTwo), parseInt(colThree)]

                // get rid of zeros
                let filteredRow = row.filter(num => num)
                // how many zeros missing
                let missing = width - filteredRow.length
                // turn missing zeros into array and fill
                let zeros = Array(missing).fill(0)
                // combine
                let newRow = zeros.concat(filteredRow)

                // change the HTML 
                tiles[i].innerHTML = newRow[0]
                tiles[i+1].innerHTML = newRow[1]
                tiles[i+2].innerHTML = newRow[2]
                tiles[i+3].innerHTML = newRow[3]
            }
        }
    }

    function moveLeft() {
        for (let i = 0; i < width * width; i++) {
            // finds the tiles in column 0
            if (i % width === 0) { // beginning of each row (0, 4, 8, 12)
                let colZero = tiles[i].innerHTML // column zero of that row
                let colOne = tiles[i + 1].innerHTML
                let colTwo = tiles[i + 2].innerHTML
                let colThree = tiles[i + 3].innerHTML
                let row = [parseInt(colZero), parseInt(colOne), parseInt(colTwo), parseInt(colThree)]
                
                // reverse to slide right
                row.reverse(); 
                
                // get rid of zeros
                let filteredRow = row.filter(num => num)
                // how many zeros missing
                let missing = width - filteredRow.length
                // turn missing zeros into array and fill
                let zeros = Array(missing).fill(0)
                // combine
                let newRow = zeros.concat(filteredRow) 

                // now that it slid right, reverse back so it's slid left
                newRow.reverse();

                // change the HTML 
                tiles[i].innerHTML = newRow[0]
                tiles[i + 1].innerHTML = newRow[1]
                tiles[i + 2].innerHTML = newRow[2]
                tiles[i + 3].innerHTML = newRow[3]
            }
        }
    }

    function moveUp() {
        for (let i = 0; i < width; i++) {
            // beginning of each column (0, 1, 2, 3)
            let rowZero = tiles[i].innerHTML // row zero of that column
            let rowOne = tiles[i + width].innerHTML // row 1 of column
            let rowTwo = tiles[i + width * 2].innerHTML // row 2 of column
            let rowThree = tiles[i + width * 3].innerHTML // row 3 of column
            let col = [parseInt(rowZero), parseInt(rowOne), parseInt(rowTwo), parseInt(rowThree)]

            // reverse to slide right
            col.reverse();

            // get rid of zeros
            let filteredCol = col.filter(num => num)
            // how many zeros missing
            let missing = width - filteredCol.length
            // turn missing zeros into array and fill
            let zeros = Array(missing).fill(0)
            // combine
            let newCol = zeros.concat(filteredCol)

            // now that it slid right, reverse back so it's slid left
            newCol.reverse();

            // change the HTML 
            tiles[i].innerHTML = newCol[0]
            tiles[i + width].innerHTML = newCol[1]
            tiles[i + width * 2].innerHTML = newCol[2]
            tiles[i + width * 3].innerHTML = newCol[3]
        }
    }

    function moveDown() {
        for (let i = 0; i < width; i++) {
            // beginning of each column (0, 1, 2, 3)
            let rowZero = tiles[i].innerHTML // row zero of that column
            let rowOne = tiles[i + width].innerHTML // row 1 of column
            let rowTwo = tiles[i + width * 2].innerHTML // row 2 of column
            let rowThree = tiles[i + width * 3].innerHTML // row 3 of column
            let col = [parseInt(rowZero), parseInt(rowOne), parseInt(rowTwo), parseInt(rowThree)]

            // get rid of zeros
            let filteredCol = col.filter(num => num)
            // how many zeros missing
            let missing = width - filteredCol.length
            // turn missing zeros into array and fill
            let zeros = Array(missing).fill(0)
            // combine
            let newCol = zeros.concat(filteredCol)

            // change the HTML 
            tiles[i].innerHTML = newCol[0]
            tiles[i + width].innerHTML = newCol[1]
            tiles[i + width * 2].innerHTML = newCol[2]
            tiles[i + width * 3].innerHTML = newCol[3]
        }
    }

    function combineRow() {
        // loop through and check if tiles have the same number
        for (let i = 0; i < width * width - 1; i++) {
            if (tiles[i].innerHTML === tiles[i+1].innerHTML) { // stop before last tile
                // update tile to be double
                let CombinedTile = parseInt(tiles[i].innerHTML) * 2
                tiles[i].innerHTML = CombinedTile
                // update to leave space (zero) where the other tile was 
                tiles[i+1].innerHTML = 0
                // update and display the new score
                score += CombinedTile
                scoreDisplay.innerHTML = score
            }
        }
        checkWin()
    }

    function combineColumn() {
        // loop through and check if tiles have the same number
        for (let i = 0; i < width * (width - 1); i++) { // stop before last row
            if (tiles[i].innerHTML === tiles[i + width].innerHTML) {
                // update tile to be double
                let CombinedTile = parseInt(tiles[i].innerHTML) * 2
                tiles[i].innerHTML = CombinedTile
                // update to leave space (zero) where the other tile was 
                tiles[i + width].innerHTML = 0
                // update and display the new score
                score += CombinedTile
                scoreDisplay.innerHTML = score
            }
        }
        checkWin()
    }

    // assign functions to keys
    function arrows(event) {
        // check if game is paused
        if (gamePause == false) {
            if (event.key === 'ArrowLeft') {
                keyLeft()
            } else if (event.key === 'ArrowRight') {
                keyRight()
            } else if (event.key === 'ArrowUp') {
                keyUp()
            } else if (event.key === 'ArrowDown') {
                keyDown()
            }
        }
    }
    // listen for arrow keys
    document.addEventListener("keyup", arrows)    

    // prevent scrolling when using arrow keys
    function noscroll(event) {
        // check if game is paused
        if (gamePause == false) {
            switch (event.code) {
                case "ArrowUp":
                case "ArrowDown":
                case "ArrowLeft":
                case "ArrowRight":
                    event.preventDefault();
                    break;
                default:
                    break;
            }
        }
    }
    document.addEventListener("keydown", noscroll)

    function keyLeft() {
        moveLeft()
        combineRow()
        moveLeft()
        generate()
        checkGameOver()
    }

    function keyRight() {
        moveRight()
        combineRow()
        moveRight()
        generate()
        checkGameOver()
    }

    function keyUp() {
        moveUp()
        combineColumn()
        moveUp()
        generate()
        checkGameOver()
    }

    function keyDown() {
        moveDown()
        combineColumn()
        moveDown()
        generate()
        checkGameOver()
    }

    // check for 2048
    function checkWin() {
        if (gameWon == true) {
            return
        } 
        for (i = 0; i < width * width; i++) {
            if (tiles[i].innerHTML == 2048) {
                gameWon = true
                resultDisplay.innerHTML = 'You Win!!!'
                // pause the game until 'continue' or 'new game' buttons are clicked 
                gamePause = true
                // display continue button
                document.getElementById("continue-game").style.display = "block"
            }
        }
    }

    // unpause game if continue button clicked
    document.getElementById("continue-game").onclick = function() {
        gamePause = false
    }

    // copy current game board
    function currentBoard() {
        let cBoard = []
        for (i = 0; i < width * width; i++) {
            cBoard.push(tiles[i].innerHTML)
        }

        // return board array
        return cBoard
    }

    // check for game over
    function checkGameOver() {
        // copy current board
        let boardOriginal = currentBoard().slice()
        let dif = false

    /*    // try to move in each direction
        keyLeft()
        let boardLeft = currentBoard().slice()
        console.log(currentBoard().slice())
        keyRight()
        let boardRight = currentBoard().slice()
        console.log(currentBoard().slice())
        keyUp()
        let boardUp = currentBoard().slice()
        console.log(currentBoard().slice())
        keyDown()
        let boardDown = currentBoard().slice()
        console.log(currentBoard().slice())    */

        // Test each direction on a copy without calling actual key functions
        // Test Left
        let testBoard = boardOriginal.slice()
        simulateMoveLeft(testBoard)
        simulateCombineRow(testBoard)
        simulateMoveLeft(testBoard)
        if (!arraysEqual(boardOriginal, testBoard)) {
            dif = true
        }

        // Test Right
        testBoard = boardOriginal.slice()
        simulateMoveRight(testBoard)
        simulateCombineRow(testBoard)
        simulateMoveRight(testBoard)
        if (!arraysEqual(boardOriginal, testBoard)) {
            dif = true
        }

        // Test Up
        testBoard = boardOriginal.slice()
        simulateMoveUp(testBoard)
        simulateCombineColumn(testBoard)
        simulateMoveUp(testBoard)
        if (!arraysEqual(boardOriginal, testBoard)) {
            dif = true
        }

        // Test Down
        testBoard = boardOriginal.slice()
        simulateMoveDown(testBoard)
        simulateCombineColumn(testBoard)
        simulateMoveDown(testBoard)
        if (!arraysEqual(boardOriginal, testBoard)) {
            dif = true
        }

        // If no moves possible, game over
        if (!dif) {
            gameOver = true
            gamePause = true
            resultDisplay.innerHTML = 'You Lose!'
        }
    }

    function arraysEqual(arr1, arr2) {
        return arr1.every((val, i) => val === arr2[i])
    }

    function simulateMoveLeft(board) {
        for (let i = 0; i < width * width; i++) {
            if (i % width === 0) {
                let row = [parseInt(board[i]), parseInt(board[i + 1]), parseInt(board[i + 2]), parseInt(board[i + 3])]
                row.reverse()
                let filteredRow = row.filter(num => num)
                let missing = width - filteredRow.length
                let zeros = Array(missing).fill(0)
                let newRow = zeros.concat(filteredRow)
                newRow.reverse()
                board[i] = newRow[0]
                board[i + 1] = newRow[1]
                board[i + 2] = newRow[2]
                board[i + 3] = newRow[3]
            }
        }
    }

    function simulateMoveRight(board) {
        for (let i = 0; i < width * width; i++) {
            if (i % width === 0) {
                let row = [parseInt(board[i]), parseInt(board[i + 1]), parseInt(board[i + 2]), parseInt(board[i + 3])]
                let filteredRow = row.filter(num => num)
                let missing = width - filteredRow.length
                let zeros = Array(missing).fill(0)
                let newRow = zeros.concat(filteredRow)
                board[i] = newRow[0]
                board[i + 1] = newRow[1]
                board[i + 2] = newRow[2]
                board[i + 3] = newRow[3]
            }
        }
    }

    function simulateMoveUp(board) {
        for (let i = 0; i < width; i++) {
            let col = [parseInt(board[i]), parseInt(board[i + width]), parseInt(board[i + width * 2]), parseInt(board[i + width * 3])]
            col.reverse()
            let filteredCol = col.filter(num => num)
            let missing = width - filteredCol.length
            let zeros = Array(missing).fill(0)
            let newCol = zeros.concat(filteredCol)
            newCol.reverse()
            board[i] = newCol[0]
            board[i + width] = newCol[1]
            board[i + width * 2] = newCol[2]
            board[i + width * 3] = newCol[3]
        }
    }

    function simulateMoveDown(board) {
        for (let i = 0; i < width; i++) {
            let col = [parseInt(board[i]), parseInt(board[i + width]), parseInt(board[i + width * 2]), parseInt(board[i + width * 3])]
            let filteredCol = col.filter(num => num)
            let missing = width - filteredCol.length
            let zeros = Array(missing).fill(0)
            let newCol = zeros.concat(filteredCol)
            board[i] = newCol[0]
            board[i + width] = newCol[1]
            board[i + width * 2] = newCol[2]
            board[i + width * 3] = newCol[3]
        }
    }

    function simulateCombineRow(board) {
        for (let i = 0; i < width * width - 1; i++) {
            if (board[i] === board[i + 1] && board[i] != 0) {
                board[i] = parseInt(board[i]) * 2
                board[i + 1] = 0
            }
        }
    }

    function simulateCombineColumn(board) {
        for (let i = 0; i < width * (width - 1); i++) {
            if (board[i] === board[i + width] && board[i] != 0) {
                board[i] = parseInt(board[i]) * 2
                board[i + width] = 0
            }
        }
    }

    /*    // if board is different any time, !game over
        let dif = false
        for (i = 0; i < width * width; i++) {
            if (boardOriginal[i] != boardLeft[i]) {
                dif = true
                console.log(dif)
                //gameOver = false
            }
            if (boardOriginal[i] != boardRight[i]) {
                dif = true
                console.log(dif)
                //gameOver = false
            }
            if (boardOriginal[i] != boardUp[i]) {
                dif = true
                console.log(dif)
                //gameOver = false
            }
            if (boardOriginal[i] != boardDown[i]) {
                dif = true
                console.log(dif)
                //gameOver = false
            } else if (dif == false){
                // else game over
                console.log(dif)
                gameOver = true
                resultDisplay.innerHTML = 'You Lose!'
            } else {
                console.log('wtf')
            }
        }     */

    
    //checkGameOver()
    /*if (gameOver == true) {
        resultDisplay.innerHTML = 'You Lose!'
    }*/

    function newGame() {
        console.log("newGame function called")
        gridDisplay.innerHTML = ''
        scoreDisplay.innerHTML = '0'
        resultDisplay.innerHTML = document.getElementById('result').innerHTML
        tiles = []
        score = 0
        gamePause = false
        gameWon = false
        gameOver = false
        createBoard()
    }

    console.log(gameOver)
})