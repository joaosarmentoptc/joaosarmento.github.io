document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const ScoreDisplay = document.querySelector('#score');
    const StartBtn = document.querySelector('#start-button')
    const width = 10;
    const __MAX_ROTATIONS__ = 4;
    const __TIMER__ = 1000;

    const lTretomino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2],
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 +1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0,1, width, width + 1],
        [0,1, width, width + 1],
        [0,1, width, width + 1],
        [0,1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const theTetrominoes = [lTretomino, zTetromino, tTetromino, oTetromino, iTetromino];


    let currentPosition = 4;
    let currentRotation = 0;

    //randomly select a piece
    let randomPiece = Math.floor((Math.random()*theTetrominoes.length))
    let current = theTetrominoes[randomPiece][currentRotation]

    //draw

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
        });
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
        })
    }


    //move down
    timerId = setInterval(moveDown, __TIMER__);

    //keyCodes
    function control(e) {
        switch(e.keyCode){
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
            default:
                break;
        }
    }

    document.addEventListener('keydown', control)

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    function freeze() {
        if(current.some( index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            randomPiece = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[randomPiece][currentRotation];
            currentPosition = 4;
            draw();
        }
    }

    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        const isBlocked = current.some(index => squares[currentPosition-1 + index].classList.contains('taken'));

        if(!isAtLeftEdge && !isBlocked) currentPosition -= 1;

        draw();
    }

    function moveRight() {
        undraw();
        const isAtRigthEdge = current.some(index => (currentPosition + index) % width === width - 1);
        const isBlocked = current.some(index => squares[currentPosition+1 + index].classList.contains('taken'));

        if(!isAtRigthEdge && !isBlocked) currentPosition += 1;

        draw();
    }

    function rotate() {
        undraw();
        currentRotation++;
        if(currentRotation === __MAX_ROTATIONS__) {
            currentRotation = 0;
        }
        current = theTetrominoes[randomPiece][currentRotation];
        draw();
    }





})