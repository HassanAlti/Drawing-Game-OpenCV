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
  const [isMobile, setIsMobile] = useState<boolean>(false);

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 1024px)").matches);
    };

    // Call once to set the initial state
    handleResize();

    // Attach the event listener
    window.addEventListener("resize", handleResize);

    return () => {
      // Cleanup event listener on unmount
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error("BASE_URL is not defined");
  }

  const sendImage = async () => {
    setIsLoadingFetch(true);
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;

    // Create a new canvas to apply a white background (opencv works best with white background on images)
    const newCanvas = document.createElement("canvas");
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    const newCtx = newCanvas.getContext("2d");

    if (!newCtx) return;
    newCtx.fillStyle = "#ffffff";
    newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);

    newCtx.drawImage(canvas, 0, 0);

    const imageBase64 = newCanvas.toDataURL("image/png");

    try {
      const response = await fetch(`${baseUrl}/api/compare-images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64,
          originalImageName: currentImage,
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
    <div>
      {isMobile ? (
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <h1 className="text-xl text-gray-700 p-5 mx-auto">
            Please open this application on your PC for the best experience. 🙂
          </h1>
        </div>
      ) : (
        <div className="absolute inset-0 -z-10 w-full h-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:1rem_1rem] flex justify-between items-center">
          <div className="flex flex-col items-center justify-center w-[75%] h-full p-5">
            <div className="flex items-center justify-center mb-5">
              <div className="flex flex-col-reverse items-center mx-5">
                <span className="mt-5 text-gray-500 text-center">
                  Line width does not matter. Overall shape does.
                </span>
                <button
                  type="button"
                  className="text-white bg-black p-2 rounded-md border border-white mt-5 mx-auto"
                  onClick={clear}
                >
                  Clear canvas
                </button>

                <canvas
                  ref={canvasRef}
                  onMouseDown={onMouseDown}
                  className="border border-black"
                  width={
                    window.matchMedia("(min-width: 1500px)").matches
                      ? 650
                      : window.matchMedia("(min-width: 1200px)").matches
                      ? 500
                      : 400
                  }
                  height={
                    window.matchMedia("(min-width: 1500px)").matches
                      ? 650
                      : window.matchMedia("(min-width: 1200px)").matches
                      ? 500
                      : 400
                  }
                />
              </div>

              <SvgSlider setCurrentImage={setCurrentImage} />
            </div>
          </div>

          <div className="fixed right-0 top-0 h-full flex flex-col gap-[2.5rem] mr-[2%] pl-[2%] py-[2.5rem] border-l border-l-black min-w-[15%] max-w-[20%] overflow-auto items-center">
            <span className="mt-5 text-gray-500 text-center">
              ! Scores are not very accurate and may vary.
            </span>
            <span className="text-gray-500 text-center">
              Check out:{" "}
              <Link
                className="text-blue-700"
                href="https://github.com/HassanAlti/Drawing-Game-OpenCV/blob/main/README.md"
              >
                README
              </Link>
            </span>
            <h1 className="text-center">Compare Your Drawing</h1>
            <h1 className="text-center">
              Score Scale: 0 = Bad 👎🏻, 5000 = Good 👍🏻
            </h1>
            <Button onClick={sendImage}></Button>

            <h1 className="text-center">
              Latest Score:{" "}
              {loadingFetch ? "Loading..." : <b> {score.toFixed(1)} </b>}
            </h1>
            <h1 className="text-center">
              Your All-Time High Score:{" "}
              {loadingAllTimeHighScore ? (
                "  Loading..."
              ) : allTimeHighScoreState !== null ? (
                <b> {" " + allTimeHighScoreState.toFixed(1)}</b>
              ) : (
                "  N/A"
              )}
            </h1>
            <h1 className="text-center">
              Your High Score For{" "}
              {currentImage.replace(".svg", "").toUpperCase()}:
              {loadingHighScore ? (
                "  Loading..."
              ) : highScoreImage !== null ? (
                <b> {"  " + highScoreImage.toFixed(1)} </b>
              ) : (
                "N/A"
              )}
            </h1>

            <Link
              href="https://github.com/HassanAlti/Drawing-Game-OpenCV"
              className="mt-auto"
            >
              <Image
                src="/images/github.svg"
                alt="Github"
                width={75}
                height={75}
              ></Image>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
