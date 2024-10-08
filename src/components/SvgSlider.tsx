import React, { useState } from "react";
import Image from "next/image";

const images: { [key: string]: "easy" | "medium" | "hard" } = {
  "chef.svg": "hard",
  "ambulance.svg": "hard",
  "apple.svg": "easy",
  "bell.svg": "easy",
  "cloud.svg": "easy",
  "controller.svg": "medium",
  "face.svg": "medium",
  "guitar.svg": "hard",
  "heart.svg": "easy",
  "hourglass.svg": "medium",
  "icecream.svg": "medium",
  "plane.svg": "medium",
  "rocket.svg": "hard",
  "skull.svg": "easy",
  "umbrella.svg": "medium",
};

const imageKeys = Object.keys(images);

interface SvgSliderProps {
  setCurrentImage: (image: string) => void;
}

export default function SvgSlider({ setCurrentImage }: SvgSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    // Loop back to the last image if at the first image
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + imageKeys.length) % imageKeys.length
    );
  };

  const handleNext = () => {
    // Loop back to the first image if at the last image
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageKeys.length);
  };

  const currentImage = imageKeys[currentIndex];
  setCurrentImage(currentImage);
  const currentDifficulty: "easy" | "medium" | "hard" = images[currentImage];

  const difficultyColor =
    currentDifficulty === "easy"
      ? "text-green-500"
      : currentDifficulty === "medium"
      ? "text-orange-500"
      : "text-red-500";

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[650px] h-full mx-auto">
      {/* Slider controls */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2"
      >
        <Image
          src="/images/left-arrow.svg"
          alt="Left Arrow"
          width={50}
          height={50}
          className="object-contain"
        />
      </button>

      {/* Display the current image */}
      <div className="flex flex-col items-center justify-center w-full max-w-[500px] h-auto aspect-square mx-5">
        <Image
          src={`/images/drawings/${currentImage}`}
          alt={`Drawing ${currentIndex + 1}`}
          width={500}
          height={500}
          className="object-contain"
        />
        {/* Display difficulty label */}
        <p className={`font-bold mt-4 ${difficultyColor}`}>
          {currentDifficulty.charAt(0).toUpperCase() +
            currentDifficulty.slice(1)}
        </p>
      </div>

      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2"
      >
        <Image
          src="/images/right-arrow.svg"
          alt="Right Arrow"
          width={50}
          height={50}
          className="object-contain"
        />
      </button>
    </div>
  );
}
