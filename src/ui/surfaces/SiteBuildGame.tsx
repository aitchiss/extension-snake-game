import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";

const BLOCK_SIZE = 25;
const TOTAL_ROW = 17;
const TOTAL_COL = 17;

export default function SiteBuildGame() {
  const boardRef = useRef<HTMLCanvasElement>(null);

  const [loaded, setLoaded] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>();

  useLayoutEffect(() => {
    if (boardRef.current) {
      console.log("&&&&&&&");
      const context = boardRef.current.getContext("2d");
      setContext(context);
      if (context) {
        context.fillStyle = "green";
        context.fillRect(0, 0, boardRef.current.width, boardRef.current.height);
      }
      placeFood();
      document.addEventListener("keyup", changeDirection);
      setInterval(update, 2000 / 10);
      setLoaded(true);
    }
  }, [loaded, boardRef]);

  let snakeX = BLOCK_SIZE * 5;
  let snakeY = BLOCK_SIZE * 5;

  // Set the total number of rows and columns
  let speedX = 0; //speed of snake in x coordinate.
  let speedY = 0; //speed of snake in Y coordinate.

  let snakeBody = [];

  let foodX;
  let foodY;

  let gameOver = false;

  //   window.onload = function () {
  //       // Set board height and width
  //       board = document.getElementById("board");
  //       board.height = total_row * blockSize;
  //       board.width = total_col * blockSize;
  //       context = board.getContext("2d");

  //       placeFood();
  //       document.addEventListener("keyup", changeDirection);  //for movements
  //       // Set snake speed
  //       setInterval(update, 1000 / 10);
  //   }

  function update() {
    if (gameOver) {
      return;
    }

    // Background of a Game
    if (context) {
      context.fillStyle = "green";
      context.fillRect(0, 0, boardRef.current.width, boardRef.current.height);

      // Set food color and position
      context.fillStyle = "yellow";
      context.fillRect(foodX, foodY, BLOCK_SIZE, BLOCK_SIZE);
    }

    if (snakeX == foodX && snakeY == foodY) {
      snakeBody.push([foodX, foodY]);
      placeFood();
    }

    // body of snake will grow
    for (let i = snakeBody.length - 1; i > 0; i--) {
      // it will store previous part of snake to the current part
      snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
      snakeBody[0] = [snakeX, snakeY];
    }

    if (context) {
      context.fillStyle = "white";
      snakeX += speedX * BLOCK_SIZE; //updating Snake position in X coordinate.
      snakeY += speedY * BLOCK_SIZE; //updating Snake position in Y coordinate.
      context.fillRect(snakeX, snakeY, BLOCK_SIZE, BLOCK_SIZE);
      for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(
          snakeBody[i][0],
          snakeBody[i][1],
          blockSize,
          blockSize
        );
      }
    }

    if (
      snakeX < 0 ||
      snakeX > TOTAL_ROW * BLOCK_SIZE ||
      snakeY < 0 ||
      snakeY > TOTAL_COL * BLOCK_SIZE
    ) {
      // Out of bound condition
      gameOver = true;
      alert("Game Over");
    }

    for (let i = 0; i < snakeBody.length; i++) {
      if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
        // Snake eats own body
        gameOver = true;
        alert("Game Over");
      }
    }
  }

  // Movement of the Snake - We are using addEventListener
  function changeDirection(e: KeyboardEvent) {
    if (e.code == "ArrowUp" && speedY != 1) {
      // If up arrow key pressed with this condition...
      // snake will not move in the opposite direction
      speedX = 0;
      speedY = -1;
    } else if (e.code == "ArrowDown" && speedY != -1) {
      //If down arrow key pressed
      speedX = 0;
      speedY = 1;
    } else if (e.code == "ArrowLeft" && speedX != 1) {
      //If left arrow key pressed
      speedX = -1;
      speedY = 0;
    } else if (e.code == "ArrowRight" && speedX != -1) {
      //If Right arrow key pressed
      speedX = 1;
      speedY = 0;
    }
  }

  // Randomly place food
  function placeFood() {
    foodX = Math.floor(Math.random() * TOTAL_COL) * BLOCK_SIZE;
    foodY = Math.floor(Math.random() * TOTAL_ROW) * BLOCK_SIZE;
  }

  return (
    <div>
      <canvas
        id="board"
        height={TOTAL_ROW * BLOCK_SIZE}
        width={TOTAL_COL * BLOCK_SIZE}
        ref={boardRef}
      ></canvas>
    </div>
  );
}
