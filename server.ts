import express from "express";
import path from "path";
import dotenv from "dotenv";
import { app, PORT, catalogFilePath } from "./server/app";
import { isGoogleDriveConfigured, pullCatalogFromDrive } from "./server/drive";

dotenv.config({ override: true });

export async function start() {
  // Sync persistent catalog from Google Drive on startup if available
  if (isGoogleDriveConfigured()) {
    try {
      console.log("Checking Google Drive for existing catalog.json...");
      await pullCatalogFromDrive(catalogFilePath);
    } catch (err) {
      console.warn("Drive catalog sync check on startup:", err);
    }
  }

  if (process.env.NODE_ENV !== "production") {
    // Dynamic import so Vite is only loaded when running the dev server locally
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const listenPort = Number(process.env.PORT || PORT || 3000);
  app.listen(listenPort, "0.0.0.0", () => {
    console.log(`Ilm-e-Ghayb Library server active on http://0.0.0.0:${listenPort}`);
  });
}

// Start the server for container / standalone mode
start();

export { app };
export default app;
