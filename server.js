require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();
const port = Number(process.env.PORT || 3000);

const allowedOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

app.disable("x-powered-by");
app.use(helmet());
app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("Origin not allowed by CORS"));
        },
        methods: ["GET", "POST"],
    })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.static("."));

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests. Please try again later." },
});

const generateLetterLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many letter generation requests. Try later." },
});

app.use(globalLimiter);

function sanitizeInput(value, maxLen = 200) {
    if (typeof value !== "string") {
        return "";
    }
    return value.replace(/\s+/g, " ").trim().slice(0, maxLen);
}

function validateGeneratePayload(body) {
    const name = sanitizeInput(body.name, 80);
    const location = sanitizeInput(body.location, 120);
    const type = sanitizeInput(body.type, 80);
    const desc = sanitizeInput(body.desc, 800);

    if (!name || !location || !type || !desc) {
        return { valid: false, error: "name, location, type, and desc are required." };
    }

    return {
        valid: true,
        data: { name, location, type, desc },
    };
}

app.get("/api/health", (_req, res) => {
    res.status(200).json({ ok: true });
});

app.post("/api/generate-letter", generateLetterLimiter, (req, res) => {
    const validation = validateGeneratePayload(req.body || {});
    if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
    }

    const { name, location, type, desc } = validation.data;

    const response = {
        letter: `To,\nThe Municipal Corporation,\n${location}\n\nSubject: Formal Complaint Regarding ${type}\n\nDear Sir/Madam,\n\nI am writing to complain about ${desc}.\n\nPlease take action.\n\nRegards,\n${name}`,
        tid: `CF-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`,
        category: "Infrastructure",
        urgency: "High",
        authority: "Municipal Corporation",
        email: "complaints@municipal.gov",
    };

    return res.status(200).json(response);
});

app.use((err, _req, res, _next) => {
    if (err && err.message === "Origin not allowed by CORS") {
        return res.status(403).json({ error: "CORS policy blocked this request origin." });
    }
    return res.status(500).json({ error: "Internal server error." });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
