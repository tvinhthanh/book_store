const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const { upload, uploadToCloudinary } = require("./middleware/upload");
const db = require("./config/db");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5175",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Test DB
app.get("/test-db", async (_req, res) => {
  try {
    const [rows] = await db.execute("SELECT 1 + 1 AS result");
    res.json({ result: rows[0].result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Auto load routes
const routesPath = path.join(__dirname, "routes");

fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith(".js")) {
    let name = file.replace(".js", "");
    name = name.replace(".routes", "");
    name = name.replace("_", "-");

    app.use(`/api/${name}`, require(`./routes/${file}`));
  }
});

// Upload image
app.post("/upload-image", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file" });
  try {
    const result = await uploadToCloudinary(req.file);
    res.json({ url: result.secure_url });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

// Serve local images
app.use("/images", express.static(path.join(__dirname, "uploads")));

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});
