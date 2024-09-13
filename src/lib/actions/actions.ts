"use server";

import client from "@/lib/db";
import { auth } from "../../auth";

export const saveScore = async (score: number, currentImage: string) => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    await client.db("ai-drawing-game").collection("scores").insertOne({
      userId,
      score,
      image: currentImage,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error in saveScore:", error);
    throw error;
  }
};

export const highScoreForImage = async (image: string) => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    console.log("session", session);

    const result = await client
      .db("ai-drawing-game")
      .collection("scores")
      .find({ userId, image })
      .sort({ score: -1 })
      .limit(1)
      .toArray();
    return result.length > 0 ? { score: result[0].score } : { score: null };
  } catch (error) {
    console.error("Error in highScoreForImage:", error);
    throw error;
  }
};

export const allTimeHighScore = async () => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    const result = await client
      .db("ai-drawing-game")
      .collection("scores")
      .find({ userId })
      .sort({ score: -1 })
      .limit(1)
      .toArray();
    return result.length > 0 ? { score: result[0].score } : { score: null };
  } catch (error) {
    console.error("Error in allTimeHighScore:", error);
    throw error;
  }
};
