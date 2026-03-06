document.addEventListener('DOMContentLoaded', () => {
    const gridDisplay = document.querySelector('.grid')
    const scoreDisplay = document.getElementById('score')
    const resultDisplay = document.getElementById('result')
    const width = 4
    let tiles = []
    let score = 0

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
        
    }

    function combineRow() {
        // loop through and check if tiles have the same number
        for (let i = 0; i < width * width - 1; i++) {
            if (tiles[i].innerHTML === tiles[i+1].innerHTML) {
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
        // checkWin()
    }

    // assign functions to keys
    function arrows(event) {
        if (event.key === 'ArrowLeft') {
            //keyLeft()
        } else if (event.key === 'ArrowRight') {
            keyRight()
            }/* else if (event.key === 'ArrowUp') {
                keyUp()
            } else if (event.key === 'ArrowDown') {
                keyDown()
            }*/
    }
    // listen for arrow keys
    document.addEventListener("keyup", arrows)    

    /*function keyLeft() {
        moveLeft()
        combineRow()
        moveLeft()
        generate()
    }*/

    function keyRight() {
        moveRight()
        combineRow()
        moveRight()
        generate()
    }
    
})