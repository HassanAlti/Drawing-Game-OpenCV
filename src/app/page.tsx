"use client";

import { useEffect, useState } from "react";
import { useDraw } from "../hooks/useDraw";

import { Draw } from "@/lib/types";
import Image from "next/image";
import Button from "@/components/Button";
import Link from "next/link";
import SvgSlider from "@/components/SvgSlider";
import {
  saveScore,
  highScoreForImage,
  allTimeHighScore,
} from "@/lib/actions/actions";

export default function Home() {
  const [score, setScore] = useState<number>(0);
  const [highScoreImage, setHighScoreImage] = useState<number>(0);
  const [allTimeHighScoreState, setAllTimeHighScoreState] = useState<number>(0);
  const [currentImage, setCurrentImage] = useState<string>("chef.svg");
  const [loadingFetch, setIsLoadingFetch] = useState<boolean>(false);
  const [loadingHighScore, setLoadingHighScore] = useState<boolean>(false);
  const [loadingAllTimeHighScore, setLoadingAllTimeHighScore] =
    useState<boolean>(false);
  const { canvasRef, onMouseDown, clear } = useDraw(drawLine);

  // high score for current image
  useEffect(() => {
    const fetchHighScore = async () => {
      setLoadingHighScore(true);
      const highScore = await highScoreForImage(currentImage);
      if (highScore) {
        setHighScoreImage(highScore.score);
      }
      setLoadingHighScore(false);
    };

    fetchHighScore();
  }, [currentImage]);

  // all time high score
  useEffect(() => {
    const fetchAllTimeHighScore = async () => {
      setLoadingAllTimeHighScore(true);
      const highScore = await allTimeHighScore();
      if (highScore) {
        setAllTimeHighScoreState(highScore.score);
      }
      setLoadingAllTimeHighScore(false);
    };

    fetchAllTimeHighScore();
  }, []);

  useEffect(() => {
    if (score > allTimeHighScoreState) {
      setAllTimeHighScoreState(score);
    }

    if (score > highScoreImage) {
      setHighScoreImage(score);
    }
  }, [score]);

  const sendImage = async () => {
    setIsLoadingFetch(true);
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;

    // Create a new canvas to apply a white background
    const newCanvas = document.createElement("canvas");
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    const newCtx = newCanvas.getContext("2d");

    if (!newCtx) return;
    newCtx.fillStyle = "#ffffff";
    newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);

    newCtx.drawImage(canvas, 0, 0);

    // Convert the canvas content to a Base64 image
    const imageBase64 = newCanvas.toDataURL("image/png");

    try {
      // Call the compare-images API
      const response = await fetch("http://localhost:8080/compare-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64,
          originalImageName: currentImage, // Specify the original image name here
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error:", errorResponse.message);
        return;
      }

      const data = await response.json();
      setScore(data.score);
      await saveScore(data.score, currentImage);
      console.log("Comparison Result:", data);
    } catch (error) {
      console.error("Error in exportImage:", error);
    }

    setIsLoadingFetch(false);
  };

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = "#000";
    const lineWidth = 5;

    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  return (
    <div className="absolute inset-0 -z-10 h-full w-full  bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] flex justify-around items-center ml-5 mr-5">
      <div className="flex">
        <div className="flex flex-col-reverse">
          <span className="mt-5 text-gray-500 ml-auto mr-auto">
            Line width doesn't matter. Overall shape does.
          </span>
          <button
            type="button"
            className="text-white bg-black p-2 rounded-md border border-white mt-5 ml-auto mr-auto"
            onClick={clear}
          >
            Clear canvas
          </button>

          <canvas
            ref={canvasRef}
            onMouseDown={onMouseDown}
            width={750}
            height={750}
            className="border border-black rounded-md"
          />
        </div>

        <SvgSlider setCurrentImage={setCurrentImage} />
      </div>

      <div className="flex flex-col gap-10 pr-10 ml-5 h-full justify-start items-center pt-10 border-l border-l-black pl-10 min-w-fit">
        <h1>Compare Your Drawing</h1>
        <h1>Score Scale: 0 = Bad 👎🏻, 5000 = Good 👍🏻</h1>
        <Button onClick={sendImage}></Button>

        <h1>
          Current Score{" "}
          {loadingFetch ? "Loading..." : <b> {score.toFixed(1)} </b>}
        </h1>
        <h1>
          Your All-Time High Score:{" "}
          {loadingAllTimeHighScore ? (
            "  Loading..."
          ) : allTimeHighScoreState !== null ? (
            <b> {" " + allTimeHighScoreState.toFixed(1)}</b>
          ) : (
            "  N/A"
          )}
        </h1>
        <h1>
          Your High Score For {currentImage.replace(".svg", "").toUpperCase()}:
          {loadingHighScore ? (
            "  Loading..."
          ) : highScoreImage !== null ? (
            <b> {"  " + highScoreImage.toFixed(1)} </b>
          ) : (
            "  N/A"
          )}
        </h1>

        <Link href="https://github.com/HassanAlti" className="mt-auto">
          <Image src="/github.svg" alt="Github" width={75} height={75}></Image>
        </Link>
      </div>
    </div>
  );
}
