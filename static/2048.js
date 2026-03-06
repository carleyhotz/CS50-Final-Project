document.addEventListener('DOMContentLoaded', () => {
    const gridDisplay = document.querySelector('.grid')
    const scoreDisplay = document.getElementById('score')
    const resultDisplay = document.getElementById('result')
    const width = 4
    let tiles = []

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

    // Example: Option 1 (e.g., the number 1) has a 70% chance, Option 2 (e.g., the number 2) has a 30% chance.
    const result = weightedRandom(2, 4, 0.7);
    console.log(result); // Will output 1 more often than 2

    // generate new tile
    function generate() {
        const randomTile = Math.floor(Math.random() * tiles.length)
        if (tiles[randomTile].innerHTML == 0) {
            // generates a new tile in a random empty cell (2 or 4, 2 has a 70% probability)
            tiles[randomTile].innerHTML = weightedRandom(2, 4, 0.7)
        } else generate()
    }
})