document.addEventListener('DOMContentLoaded', () => {
    const gridDisplay = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const resultDisplay = document.getElementById('result');
    const initialResultText = resultDisplay.innerHTML;
    const width = 4;
    let tiles = [];
    let score = 0;
    let gamePause = false;
    let gameWon = false;
    let gameOver = false;


    /* -- board and tile setup -- */
    // create the board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            //create tiles in the grid and innitialize to 0
            const tile = document.createElement('div');
            tile.innerHTML = 0;
            gridDisplay.appendChild(tile);
            tiles.push(tile);
        }
        //generate first 2 tiles
        generate();
        generate();
        addColors();
    }
    createBoard();

    // creates new game board and resets all variables when button is clicked or page is refreshed
    document.getElementById('new-game').onclick = newGame;
    window.onload = newGame;

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
        // gather the indices of all empty tiles
        const zeroIndices = [];

        tiles.forEach((tile, index) => {    // loop through all tiles on the board
            if (tile.innerHTML == 0) {      // checks if tile empty
                zeroIndices.push(index);    // adds index of tile to array
            }
        });

        // check if board full
        if (zeroIndices.length === 0) {
            return;
        }

        // pick a random empty tile and stores the index
        const randomTile = zeroIndices[Math.floor(Math.random() * zeroIndices.length)];

        // generates a new tile (2 or 4, 2 has a 70% probability) at that index
        tiles[randomTile].innerHTML = weightedRandom(2, 4, 0.7);

        addColors(); // add colors after generating new tile
    }

    /* -- helper functions for board manipulation -- */
    // get current board state
    function currentBoard() {
        return tiles.map(t => parseInt(t.innerHTML)); // convert tile values to array of integers
    }

    // apply a board state
    function applyBoard(board) {
        for (let i = 0; i < board.length; i++) {
            tiles[i].innerHTML = board[i]; // takes an array of integers and updates the tile values on the board
        }
        addColors(); // add colors after updating tile values
    }

    // compare two arrays (used to check if board changed after a move)
    function arraysEqual(a, b) {
        // compares size of arrays & checks values and their order
        return a.length === b.length && a.every((value, index) => value === b[index]);
    }

    /* -- helper functions for tile colors -- */
    // add colors to tiles based on their values
    function addColors() {
        // map tile values to CSS variable names
        const colorMap = {
            0: '--grid',
            2: '--orange',
            4: '--yellow',
            8: '--ltgreen',
            16: '--dkgreen',
            32: '--ltblue',
            64: '--dkblue',
            128: '--indigo',
            256: '--purple',
            512: '--indigo',
            1024: '--purple',
            2048: '--dkblue',
            // add more as needed, e.g., 256: '--another-color'
        };

        // loop through tiles and set background color based on value
        tiles.forEach(tile => {
            const value = parseInt(tile.innerHTML);
            // get the computed styles of the root element to access CSS variables
            const rootStyles = getComputedStyle(document.documentElement);
            // looks up CSS variable name based on tile value
            let colorVar = colorMap[value];
            
            // if no mapping exists and value is >= 2048, use dkblue
            if (!colorVar && value >= 2048) {
                colorVar = '--dkblue';
            }

            // adjust font size based on tile value
            if (value >= 1024) {
                tile.style.fontSize = '35px';  // smaller for 4+ digits
            } else if (value >= 128) {
                tile.style.fontSize = '45px';  // medium for 3 digits
            } else {
                tile.style.fontSize = '60px';  // default for smaller numbers
            }

            if (colorVar) {
                tile.style.backgroundColor = rootStyles.getPropertyValue(colorVar).trim();
            } else {
                tile.style.backgroundColor = '#DADBDC'; // default for empty or unmapped tiles
            }
        });
    }


    /* -- pure logic (no DOM) slide and combine functions -- */
    function slideLeft(array) {
        let newBoard = array.slice();
        for (let row = 0; row < width; row++) {                                         // [0,2,0,4]
            // get current row and filter out zeros
            let line = newBoard.slice(row * width, row * width + width).filter(n => n); // [2,4]
            // add zeros to the end of the row  
            while (line.length < width) line.push(0);                                   // [2,4,0,0]
            // update the new board with the slid row                                   // update board
            newBoard.splice(row * width, width, ...line);
        }
        return newBoard;
    }

    function slideRight(array) {
        let newBoard = array.slice();
        for (let row = 0; row < width; row++) {
            let line = newBoard.slice(row * width, row * width + width).filter(n => n);
            // add zeros to the beginning of the row
            while (line.length < width) line.unshift(0);
            newBoard.splice(row * width, width, ...line);
        }
        return newBoard;
    }

    function slideUp(array) {
        let newBoard = array.slice();
        for (let col = 0; col < width; col++) {
            // get current column and filter out zeros
            let line = [];
            for (let r = 0; r < width; r++) line.push(newBoard[col + r * width]);
            line = line.filter(n => n);
            // add zeros to the end of the column
            while (line.length < width) line.push(0);
            // update the new board with the slid column
            for (let r = 0; r < width; r++) newBoard[col + r * width] = line[r];
        }
        return newBoard;
    }

    function slideDown(array) {
        let newBoard = array.slice();
        for (let col = 0; col < width; col++) {
            let line = [];
            for (let r = 0; r < width; r++) line.push(newBoard[col + r * width]);
            line = line.filter(n => n);
            // add zeros to the beginning of the column
            while (line.length < width) line.unshift(0);
            for (let r = 0; r < width; r++) newBoard[col + r * width] = line[r];
        }
        return newBoard;
    }

    function combineLeft(array) {
        // create a copy of the board to modify
        let newBoard = array.slice();
        for (let i = 0; i < width * width - 1; i++) {
            // check if not on right edge & current tile is nonzero & current tile equals next tile
            if (i % width !== width - 1 && newBoard[i] && newBoard[i] === newBoard[i + 1]) {
                // doubles current tile and sets next tile to 0
                newBoard[i] *= 2;
                newBoard[i + 1] = 0;
                score += newBoard[i]; // update score
            }
        }
        return newBoard;
    }

    function combineRight(array) {
        let newBoard = array.slice();
        for (let i = 1; i < width * width; i++) {
            // check if not on left edge & current tile is nonzero & current tile equals previous tile
            if (i % width !== 0 && newBoard[i] && newBoard[i] === newBoard[i - 1]) {
                newBoard[i] *= 2;
                newBoard[i - 1] = 0;
                score += newBoard[i];
            }
        }
        return newBoard;
    }

    function combineUp(array) {
        let newBoard = array.slice();
        for (let i = 0; i < width * (width - 1); i++) { // loop through all tiles except bottom row
            // check if current tile is nonzero & current tile equals tile below
            if (newBoard[i] && newBoard[i] === newBoard[i + width]) {
                newBoard[i] *= 2;
                newBoard[i + width] = 0;
                score += newBoard[i];
            }
        }
        return newBoard;
    }

    function combineDown(array) {
        let newBoard = array.slice();
        for (let i = width; i < width * width; i++) { // loop through all tiles except top row
            // check if current tile is nonzero & current tile equals tile above
            if (newBoard[i] && newBoard[i] === newBoard[i - width]) {
                newBoard[i] *= 2;
                newBoard[i - width] = 0;
                score += newBoard[i];
            }
        }
        return newBoard;
    }
    /* -------------------------------------------------- */

    /* -- game state checks -- */
    // check for 2048
    function checkWin() {
        if (gameWon == true) {
            return
        }
        if (currentBoard().some(n => n === 2048)) { // check if any tile has value 2048
            gameWon = true;
            resultDisplay.innerHTML = 'You Win!!!';
            // pause the game until 'continue' or 'new game' buttons are clicked
            gamePause = true;
            // display continue button
            document.getElementById('continue-game').style.display = 'block';
        }
    }

    // check for game over (no moves left)
    function checkGameOver() {
        // captures current board to compare with possible moves
        const b = currentBoard();
        // if all possible moves result in the same board, game over
        if (
            // checks board b vs b that has been slid and combined in each direction
            arraysEqual(b, slideLeft(combineLeft(slideLeft(b)))) && // simulate a left move on board copy and check if board changes
            arraysEqual(b, slideRight(combineRight(slideRight(b)))) &&
            arraysEqual(b, slideUp(combineUp(slideUp(b)))) &&
            arraysEqual(b, slideDown(combineDown(slideDown(b))))
        ) {
            gameOver = true;
            gamePause = true;
            resultDisplay.innerHTML = 'You Lose!';
        }
    }

    /* -- key movement functions -- */
    function keyLeft() {
        let b = currentBoard();
        // create a copy of the board to compare after move
        let original = b.slice();
        b = slideLeft(b);
        b = combineLeft(b);
        b = slideLeft(b);
        // prevent generating a new tile if the board didn't change
        if (!arraysEqual(original, b)) {
            applyBoard(b);
            scoreDisplay.innerHTML = score;
            generate();
        }
        checkWin();
        checkGameOver();
    }

    function keyRight() {
        let b = currentBoard();
        let original = b.slice();
        b = slideRight(b);
        b = combineRight(b);
        b = slideRight(b);
        if (!arraysEqual(original, b)) {
            applyBoard(b);
            scoreDisplay.innerHTML = score;
            generate();
        }
        checkWin();
        checkGameOver();
    }

    function keyUp() {
        let b = currentBoard();
        let original = b.slice();
        b = slideUp(b);
        b = combineUp(b);
        b = slideUp(b);
        if (!arraysEqual(original, b)) {
            applyBoard(b);
            scoreDisplay.innerHTML = score;
            generate();
        }
        checkWin();
        checkGameOver();
    }

    function keyDown() {
        let b = currentBoard();
        let original = b.slice();
        b = slideDown(b);
        b = combineDown(b);
        b = slideDown(b);
        if (!arraysEqual(original, b)) {
            applyBoard(b);
            scoreDisplay.innerHTML = score;
            generate();
        }
        checkWin();
        checkGameOver();
    }

    /* -- event listeners for key presses and controls -- */
    // assign functions to key presses
    function arrows(event) {
        // check if game is paused
        if (gamePause) {
            return;
        }
        // use either arrow keys or WASD keys to move
        switch (event.key.toLowerCase()) {
            case 'arrowleft':
            case 'a':
                keyLeft();
                break;
            case 'arrowright':
            case 'd':
                keyRight();
                break;
            case 'arrowup':
            case 'w':
                keyUp();
                break;
            case 'arrowdown':
            case 's':
                keyDown();
                break;
        }
    }
    document.addEventListener('keyup', arrows);

    // prevent scrolling when using arrow keys during gameplay
    function noscroll(event) {
        if (!gamePause && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
            event.preventDefault();
        }
    }
    document.addEventListener('keydown', noscroll);

    // unpause game if continue button clicked
    document.getElementById("continue-game").onclick = function () {
        gamePause = false;
    }

    // start a new game if new game button clicked, resets all variables and creates new board
    function newGame() {
        gridDisplay.innerHTML = '';
        scoreDisplay.innerHTML = '0';
        resultDisplay.innerHTML = initialResultText;
        tiles = [];
        score = 0;
        gamePause = false;
        gameWon = false;
        gameOver = false;
        createBoard();
    }
});