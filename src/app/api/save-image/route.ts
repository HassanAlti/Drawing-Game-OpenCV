import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { message: "No image data provided" },
        { status: 400 }
      );
    }

    // Decode base64 image
    const base64Data = image.replace(/^data:image\/png;base64,/, "");

    // Define the file path and name
    const filePath = path.join(
      process.cwd(),
      "public/images",
      `canvas-${Date.now()}.png`
    );

    // Save the image to the server
    fs.writeFileSync(filePath, base64Data, "base64");

    return NextResponse.json({ message: "Image saved successfully", filePath });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error saving image", error: error.message },
      { status: 500 }
    );
  }
}
