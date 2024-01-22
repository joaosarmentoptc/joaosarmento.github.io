document.addEventListener('DOMContentLoaded', () => {

    const GRID_WIDTH = 10;
    const GRID_HEIGHT = 20;
    const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT;
    const INITIAL_POSITION = 4;
    const TIMER = 1000;

    const colors = [
        'url(images/blue_block.png)',
        'url(images/pink_block.png)',
        'url(images/purple_block.png)',
        'url(images/peach_block.png)',
        'url(images/yellow_block.png)'
    ];

    const startButton = document.querySelector('.button');
    
    let timerId;

    let currentRotation = 0;
    let nextRandomPiece = 0;
    let displayIndex = 0;
    const displayWidth = 4;


    const lTetromino = [
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 2],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
        [GRID_WIDTH, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2]
    ]

    const zTetromino = [
        [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
        [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1]
    ]

    const tTetromino = [
        [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
        [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1]
    ]

    const iTetromino = [
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    const smallTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], /* lTetromino */
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], /* zTetromino */
        [1, displayWidth, displayWidth + 1, displayWidth + 2], /* tTetromino */
        [0, 1, displayWidth, displayWidth + 1], /* oTetromino */
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] /* iTetromino */
    ];

    const grid = createGrid();
    let squares = Array.from(grid.querySelectorAll('div'));
    const displaySquares = document.querySelectorAll('.preview-grid div');


    function createGrid() {
        let grid = document.querySelector(".grid");
        for (let i = 0; i < GRID_SIZE; i++) {
            let gridElement = document.createElement("div");
            grid.appendChild(gridElement);
        }

        // add base
        for (let i = 0; i < GRID_WIDTH; i++) {
            let gridElement = document.createElement("div");
            gridElement.setAttribute("class", "block3");
            grid.appendChild(gridElement);
        }

        let previewGrid = document.querySelector(".preview-grid");
        for(let i = 0; i < 16; i++) {
            let gridElement = document.createElement("div");
            previewGrid.appendChild(gridElement);
        }
        return grid;
    }

    function control(e) {
        switch(e.keyCode) {
            case 37:
                //moveLeft();
                break;
            case 38:
                //rotate();
                break;
            case 39:
                //moveRight();
                break;
            case 40:
                moveDown();
                break;
            default:
                break;
        }
    }

    document.addEventListener('keydown', control);

    let randomPiece = Math.floor(Math.random() * theTetrominoes.length);
    let currentPiece = theTetrominoes[randomPiece][currentRotation];

    let currentPosition = INITIAL_POSITION;

    function draw() {
        currentPiece.forEach( index => {
            squares[currentPosition + index].classList.add('block');
            squares[currentPosition + index].style.backgroundImage = colors[randomPiece];
        });
    }

    function undraw() {
        currentPiece.forEach( index => {
            squares[currentPosition + index].classList.remove('block');
            squares[currentPosition + index].style.backgroundImage = 'none'
        });
    }

    function freeze() {
        if (currentPiece.some( index => squares[currentPosition + index + GRID_WIDTH].classList.contains('block3') ||
        squares[currentPosition + index + GRID_WIDTH].classList.contains('block2') )) {
            currentPiece.forEach(index => squares[index + currentPosition].classList.add('block2'));
            randomPiece = nextRandomPiece;
            nextRandomPiece = Math.floor(Math.random() * theTetrominoes.length);
            currentPiece = theTetrominoes[randomPiece][currentRotation];
            currentPosition = INITIAL_POSITION;
            draw();
            displayPreview();
        }
    }

    function moveDown() {
        undraw();
        currentPosition += GRID_WIDTH;
        draw();
        freeze();
    }



    startButton.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, TIMER);
            nextRandomPiece = Math.floor(Math.random() * theTetrominoes.length);
            displayPreview();
        }
    });


    function displayPreview() {
        displaySquares.forEach( square => {
            square.classList.remove('block');
            square.style.backgroundImage = 'none';
        });

        smallTetrominoes[nextRandomPiece].forEach(index => {
            displaySquares[displayIndex + index].classList.add('block');
            displaySquares[displayIndex + index].style.backgroundImage = colors[nextRandomPiece];
        })

    }



})