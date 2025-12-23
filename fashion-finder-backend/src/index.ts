import { File } from "formdata-node"; // install with: npm i formdata-node
// Add this at the very top of index.ts
(globalThis as any).File = File;

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { v1 as vision } from "@google-cloud/vision"
import { searchClothing } from "./routes.js";
import multer from "multer";
import * as cheerio from "cheerio";




dotenv.config();
const app = express();
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });
const client = new vision.ImageAnnotatorClient();
app.use(express.json());

app.post("/api/search", searchClothing);
app.post("/api/vision", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const [result] = await client.webDetection({
            image: { content: req.file.buffer },
        });
        const results = [];
        if (result.webDetection) {
            for (const page of result.webDetection?.pagesWithMatchingImages ?? []) {
                for (const image of page.fullMatchingImages ?? []) {
                    results.push({
                        imageUrl: image.url,
                        pageUrl: page.url
                    });
                }
            }
        }
        res.json(results);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Vision API error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

