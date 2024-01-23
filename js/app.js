document.addEventListener('DOMContentLoaded', () => {

    const GRID_WIDTH = 10;
    const GRID_HEIGHT = 20;
    const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT;
    const INITIAL_POSITION = 4;
    const TIMER = 1000;
    let level = 0;
    const ROTATIONS = 4;

    const colors = [
        'url(images/blue_block.png)',
        'url(images/pink_block.png)',
        'url(images/purple_block.png)',
        'url(images/peach_block.png)',
        'url(images/yellow_block.png)'
    ];

    const startButton = document.querySelector('.button');
    const leftButton = document.querySelector('.buttonLeft');
    const rightButton = document.querySelector('.buttonRight');
    const upButton = document.querySelector('.buttonUp');
    const downButton = document.querySelector('.buttonDown');
    const scoreDisplay = document.querySelector('.score-display');
    const linesDisplay = document.querySelector('.lines-score');
    const levelDisplay = document.querySelector('.level-score');
    
    let timerId;
    let isGameOver = false;
    let score = 0;
    let lines = 0;

    let currentRotation = 0;
    let nextRandomPiece = null;
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
                moveLeft();
                break;
            case 38:
                rotate();
                break;
            case 39:
                moveRight();
                break;
            case 40:
                moveDown();
                break;
            default:
                break;
        }
    }

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
            currentRotation = 0;
            currentPiece.forEach(index => squares[index + currentPosition].classList.add('block2'));
            randomPiece = nextRandomPiece;
            nextRandomPiece = Math.floor(Math.random() * theTetrominoes.length);
            currentPiece = theTetrominoes[randomPiece][currentRotation];
            clearLine();
            currentPosition = INITIAL_POSITION;
            draw();
            displayPreview();
            gameOver();
        }
    }

    function moveDown() {
        if (timerId) {
            undraw();
            currentPosition += GRID_WIDTH;
            draw();
            freeze();
        }
    }

    function moveRight() {
        if (timerId) {
            const isAtRightEdge = currentPiece.some(index => (currentPosition + index) % GRID_WIDTH === GRID_WIDTH - 1);
            const hasBlock = currentPiece.some(index => squares[currentPosition + index + 1].classList.contains('block2'));
            if (!isAtRightEdge && !hasBlock) {
                undraw();
                currentPosition += 1;
                draw();
            }
        }
    }

    function moveLeft() {
        if (timerId) {
            const isAtLeftEdge = currentPiece.some(index => (currentPosition + index) % GRID_WIDTH === 0);
            const hasBlock = currentPiece.some(index => squares[currentPosition + index - 1].classList.contains('block2'));
            if (!isAtLeftEdge && !hasBlock) {
                undraw();
                currentPosition -= 1;
                draw();
            }
        }
    }

    function isAtRight() {
        return currentPiece.some(index=> (currentPosition + index + 1) % GRID_WIDTH === 0)  
      }
      
      function isAtLeft() {
        return currentPiece.some(index=> (currentPosition + index) % GRID_WIDTH === 0)
      }
      
      function checkRotatedPosition(P){
        P = P || currentPosition       
        if ((P+1) % GRID_WIDTH < 4) {  
          if (isAtRight()){            
            currentPosition += 1    
            checkRotatedPosition(P) 
            }
        }
        else if (P % GRID_WIDTH > 5) {
          if (isAtLeft()){
            currentPosition -= 1
          checkRotatedPosition(P)
          }
        }
      }

    function rotate() {
        if (timerId) {
            undraw();
            currentRotation++;
            if (currentRotation === ROTATIONS) {
                currentRotation = 0;
            }
            currentPiece = theTetrominoes[randomPiece][currentRotation];
            checkRotatedPosition();
            draw();
        }
    }

    function gameOver() {
        if (currentPiece.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            clearInterval(timerId); 
            timerId = null;
            document.removeEventListener('keydown', control);
            isGameOver = true;
        }
    }

    startButton.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
            document.removeEventListener('keydown', control);
        } else {
            if (isGameOver) {
                resetScreen();
                isGameOver = false;
            }
            document.addEventListener('keydown', control);
            draw();
            timerId = setInterval(moveDown, TIMER - (level * 10));
            if(nextRandomPiece === null) {
                nextRandomPiece = Math.floor(Math.random() * theTetrominoes.length);
            }
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

    function resetScreen() {
        for( currentIndex = 0; currentIndex < GRID_SIZE; currentIndex += 1) {
            score = 0;            
            lines = 0;
            level = 0;
            scoreDisplay.innerHTML = score;
            linesDisplay.innerHTML = lines;
            levelDisplay.innerHTML = level + 1;
            squares[currentIndex].style.backgroundImage = 'none';
            squares[currentIndex].classList.remove('block2');
        }
    }

    function clearLine() {

        for( currentIndex = 0; currentIndex < GRID_SIZE; currentIndex += GRID_WIDTH) {
            const row = [currentIndex, currentIndex + 1, currentIndex + 2, currentIndex + 3, currentIndex + 4, currentIndex + 5, currentIndex + 6, currentIndex + 7, currentIndex + 8, currentIndex + 9]
            if (row.every(index => squares[index].classList.contains('block2'))) {
                score += 10;
                lines += 1;
                scoreDisplay.innerHTML = score;
                linesDisplay.innerHTML = lines;

                row.forEach( index => {
                    squares[index].style.backgroundImage = 'none';
                    squares[index].classList.remove('block2')
                });

                const squaresRemoved = squares.splice(currentIndex, GRID_WIDTH);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));

                levelUp();
            }
        }

    }

    function levelUp() {
        if ( lines < 5) level = 0;
        else if ( lines >= 5 && lines < 10) level = 1;
        else if ( lines >= 10 && lines < 15) level = 2;
        else if ( lines >= 15 && lines < 20) level = 3;
        else if ( lines >= 20 && lines < 25) level = 4;
        else if ( lines >= 25 && lines < 30) level = 5;
        else if (lines > 30) level = 6;

        clearInterval(timerId);
        timerId = setInterval(moveDown, TIMER - (level * 100));
        levelDisplay.innerHTML = level + 1;
    }


    leftButton.addEventListener('click', moveLeft);
    rightButton.addEventListener('click', moveRight);
    upButton.addEventListener('click', rotate);
    downButton.addEventListener('click', moveDown);





})