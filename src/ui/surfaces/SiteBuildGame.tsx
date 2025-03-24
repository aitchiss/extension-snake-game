import {
  Button,
  ButtonGroup,
  Form,
  Select,
} from "@netlify/sdk/ui/react/components";
import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";

const BLOCK_SIZE = 20;
const TOTAL_ROW = 20;
const TOTAL_COL = 25;
const BOARD_HEIGHT = TOTAL_ROW * BLOCK_SIZE;
const BOARD_WIDTH = TOTAL_COL * BLOCK_SIZE;
const SPEED = 12;

// TODO:
// - Speed settings
//  - Types

export default function SiteBuildGame() {
  const boardRef = useRef<HTMLCanvasElement>(null);
  const focusHandlerBtnRef = useRef<HTMLButtonElement>(null);
  const foodRef = useRef<SVGElement>(null);

  const [loaded, setLoaded] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>();
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);

  let intervalId;

  useLayoutEffect(() => {
    if (boardRef.current) {
      const context = boardRef.current.getContext("2d");
      setContext(context);
      if (context) {
        context.fillStyle = "#929678";
        context.fillRect(0, 0, boardRef.current.width, boardRef.current.height);
      }
      placeFood();
      document.addEventListener("keyup", changeDirection);
      // Small timeout to make sure changing between games on the side panel doesn't steal focus first
      setTimeout(() => focusHandlerBtnRef.current?.focus(), 100);
      intervalId = setInterval(update, 2000 / SPEED);
      setLoaded(true);
    }

    return () => () => {
      document.removeEventListener("keyup", changeDirection);
      clearInterval(intervalId);
    };
  }, [loaded, boardRef]);

  let snakeX = BLOCK_SIZE * 5;
  let snakeY = BLOCK_SIZE * 5;

  // Set the total number of rows and columns
  let speedX = 0; //speed of snake in x coordinate.
  let speedY = 0; //speed of snake in Y coordinate.

  let snakeBody = [];

  let foodX;
  let foodY;

  function update() {
    // Background of a Game
    if (context) {
      context.fillStyle = "#929678";
      context.fillRect(0, 0, boardRef.current.width, boardRef.current.height);

      // Set food position
      if (foodRef.current) {
        foodRef.current.style.left = `${foodX}px`;
        foodRef.current.style.top = `${foodY}px`;
      }
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
      setScore(snakeBody.length);
    }

    if (context) {
      context.fillStyle = "#36382d";
      snakeX += speedX * BLOCK_SIZE; //updating Snake position in X coordinate.
      snakeY += speedY * BLOCK_SIZE; //updating Snake position in Y coordinate.
      context.fillRect(snakeX, snakeY, BLOCK_SIZE, BLOCK_SIZE);
      for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(
          snakeBody[i][0],
          snakeBody[i][1],
          BLOCK_SIZE,
          BLOCK_SIZE
        );
      }
    }

    if (
      snakeX < 0 ||
      snakeX > BOARD_WIDTH ||
      snakeY < 0 ||
      snakeY > BOARD_HEIGHT
    ) {
      // Out of bound condition
      setGameOver(true);
      clearInterval(intervalId);
    }

    for (let i = 0; i < snakeBody.length; i++) {
      if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
        // Snake eats own body
        setGameOver(true);
        clearInterval(intervalId);
      }
    }
  }

  // Movement of the Snake - We are using addEventListener
  function changeDirection(e: KeyboardEvent) {
    if (!gameStarted) {
      setGameStarted(true);
    }
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

  function resetGame() {
    window.location.reload();
  }

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-relative">
      <button
        tabIndex={-1}
        className="tw-sr-only"
        aria-label="Press any arrow key to start the game"
        ref={focusHandlerBtnRef}
      ></button>

      <div className="tw-mb-2 tw-flex tw-flex-col tw-items-center tw-gap-2 tw-w-full tw-min-h-[75px]">
        {!gameStarted && <h3>Press any arrow key to start the game</h3>}
        {gameOver && (
          <div className="tw-flex tw-gap-4 tw-items-center">
            <h3 className="tw-shrink-0">Game Over!</h3>
            <Button onClick={resetGame} className="">
              Reset
            </Button>
          </div>
        )}
        <h3>Your score: {score}</h3>
      </div>
      <div className="tw-relative">
        <svg
          ref={foodRef}
          xmlns="http://www.w3.org/2000/svg"
          width={BLOCK_SIZE}
          height={BLOCK_SIZE}
          viewBox="0 0 48 48"
          aria-hidden="true"
          className="tw-border-1 tw-absolute "
          color={"#36382d"}
        >
          <path
            fillRule="evenodd"
            d="m27.46 1.05 19.49 19.49.72.72.33.8v3.88l-.33.8-.72.72-19.49 19.49-.72.72-.8.33h-3.88l-.8-.33-.72-.72L1.05 27.46l-.72-.72-.33-.8v-3.88l.33-.8.72-.72L20.54 1.05l.72-.72.8-.33h3.88l.8.33zm-5.2 33.1v9.36l.25.25h2.98l.25-.25v-9.36l-.25-.25h-2.98zm0-20.3V4.5l.25-.25h2.98l.25.25v9.36l-.25.25h-2.98l-.25-.25ZM14 36.57h.4l2.73-2.73v-2.16l-.29-.3h-2.16l-2.73 2.73v.41zM11.94 14v-.4l2.05-2.06h.4l2.73 2.73v2.17l-.29.29h-2.16zm2.29 8.27H3.7l-.25.25v2.98l.25.25h10.53l.24-.25v-3l-.24-.25Zm15.35 7.94H26.6l-.24-.25V23c0-1.25-.49-2.2-1.99-2.24-.77-.02-1.65 0-2.59.04l-.14.15v9.01l-.25.25h-2.97l-.25-.25v-11.9l.25-.25h6.7c2.6 0 4.7 2.1 4.7 4.71v7.44zm4.2-4.46H44.3l.25-.25v-2.98l-.25-.25H33.77l-.24.25v2.98l.24.25Z"
          ></path>
        </svg>
        <canvas
          id="board"
          className="tw-m-auto"
          height={TOTAL_ROW * BLOCK_SIZE}
          width={TOTAL_COL * BLOCK_SIZE}
          ref={boardRef}
        ></canvas>
      </div>
    </div>
  );
}
