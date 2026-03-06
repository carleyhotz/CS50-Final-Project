document.addEventListener('DOMContentLoaded', () => {
    const gridDisplay = document.querySelector('.grid')
    const scoreDisplay = document.getElementById('score')
    const resultDisplay = document.getElementById('result')
    const width = 4
    let tiles = []
    let score = 0
    let gamePause = false
    let gameWon = false

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
    checkWin()

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
    }

    function keyRight() {
        moveRight()
        combineRow()
        moveRight()
        generate()
    }

    function keyUp() {
        moveUp()
        combineColumn()
        moveUp()
        generate()
    }

    function keyDown() {
        moveDown()
        combineColumn()
        moveDown()
        generate()
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
    
})