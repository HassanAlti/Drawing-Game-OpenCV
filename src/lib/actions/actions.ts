"use server";

import client from "@/lib/db";

export const saveScore = async (score: number, currentImage: string) => {
  try {
    await client.db("ai-drawing-game").collection("scores").insertOne({
      score,
      image: currentImage,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error in saveScore:", error);
  }
};

export const highScoreForImage = async (image: string) => {
  try {
    const result = await client
      .db("ai-drawing-game")
      .collection("scores")
      .find({ image })
      .sort({ score: -1 })
      .limit(1)
      .toArray();
    return result.length > 0 ? { score: result[0].score } : { score: null };
  } catch (error) {
    console.error("Error in highScoreForImage:", error);
  }
};

export const allTimeHighScore = async () => {
  try {
    const result = await client
      .db("ai-drawing-game")
      .collection("scores")
      .find()
      .sort({ score: -1 })
      .limit(1)
      .toArray();
    return result.length > 0 ? { score: result[0].score } : { score: null };
  } catch (error) {
    console.error("Error in allTimeHighScore:", error);
  }
};
