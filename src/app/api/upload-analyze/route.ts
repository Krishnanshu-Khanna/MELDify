import axios from "axios";
import FormData from "form-data";
import { NextResponse } from "next/server";
import { env } from "~/env";
import cloudinary from "~/lib/cloudinary";
import { db } from "~/server/db";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File;
  const apiKey = form.get("apiKey") as string;

  if (!file || !apiKey) {
    return NextResponse.json(
      { error: "File and API key required" },
      { status: 400 },
    );
  }

  const quota = await db.apiQuota.findUnique({
    where: { secretKey: apiKey },
    select: { userId: true },
  });

  if (!quota) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Step 1: Upload to Cloudinary
  interface CloudinaryUploadResult {
    secure_url: string;
    [key: string]: unknown;
  }

  const cloudRes = await new Promise<CloudinaryUploadResult>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "video",
            folder: "cvgenie_videos",
          },
          (error, result) => {
            if (error)
              reject(
                new Error(
                  typeof error === "string"
                    ? error
                    : (error?.message ?? "Cloudinary upload failed"),
                ),
              );
            else resolve(result as CloudinaryUploadResult);
          },
        )
        .end(buffer);
    },
  );

  const videoUrl = cloudRes.secure_url;

  // Step 2: Send to FastAPI
  const fastapiForm = new FormData();
  fastapiForm.append("file", buffer, file.name);

  let analysisRes;
  try {
    analysisRes = await axios.post(env.API_URL + "/predict", fastapiForm, {
      headers: {
        ...fastapiForm.getHeaders(),
      },
    });
  } catch (error: unknown) {
    console.error("FastAPI error:", error);
    let details: unknown = undefined;
    if (error && typeof error === "object" && "response" in error && error.response && typeof error.response === "object" && "data" in error.response) {
      details = (error.response as { data?: unknown }).data;
    }
    return NextResponse.json(
      {
        error: "Prediction API failed",
        details,
      },
      { status: 422 },
    );
  }

  // Step 3: Save in DB
  await db.videoFile.create({
    data: {
      userId: quota.userId,
      url: videoUrl,
      analyzed: true,
    },
  });

  return analysisRes.data as NextResponse;
}
