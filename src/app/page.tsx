"use client";

import { FC, useEffect, useState } from "react";
import { useDraw } from "../hooks/useDraw";
import { ChromePicker } from "react-color";
import { Draw } from "@/lib/types";

export default function Home() {
  const [color, setColor] = useState<string>("#000");
  const { canvasRef, onMouseDown, clear, exportImage } = useDraw(drawLine);

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = color;
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
    <div className="absolute inset-0 -z-10 h-full w-full  bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] flex justify-start items-center">
      <div className="flex flex-col gap-10 pr-10 ml-5">
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
        <button
          type="button"
          className="text-white bg-black p-2 rounded-md border border-white"
          onClick={clear}
        >
          Clear canvas
        </button>
        <button
          type="button"
          className="text-white bg-black p-2 rounded-md border border-white"
          onClick={exportImage}
        >
          Export
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        width={750}
        height={750}
        className="border border-black rounded-md"
      />
    </div>
  );
}
