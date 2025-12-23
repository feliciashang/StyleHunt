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

async function extractImages(urls: string[]): Promise<string[]> {
    const images: string[] = []
    for (const url of urls) {
        try {
            const response = await fetch(url, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Referer": "https://www.google.com/",
                },
            });
            if (response.ok) {
                const html: string = await response.text();
                const $ = cheerio.load(html);

                const mainImage: string | undefined = $('meta[property="og:image"]').attr("content");

                if (mainImage) {
                    images.push(mainImage);
                    console.log("could find " + url + mainImage)
                } else {
                    console.log("could not find" + url)
                }
            } else {
                console.log("there has been an error " + url + " " + response.statusText)
            }
        } catch (err) {
            console.error(err);
        }
    }
    return images
}
