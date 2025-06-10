import express, { json, urlencoded } from "express";
import { static as expressStatic } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import hpp from "hpp";
import { join, dirname } from "path";
import AppError from "./src/utils/appError.js";
import globalErrorHandler from "./src/middlewares/error.middleware.js";
import routes from "./src/routes/index.js";
import { setupSwagger } from "./src/config/swagger.js";
import { connectDB } from "./src/config/dbConnection.js";
import { fileURLToPath } from 'url';
import { exec} from "child_process";
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configure DOM Purify
const window = new JSDOM("").window;
const domPurify = DOMPurify(window);

// 1. Database connection
connectDB();

// 2. Global Middlewares

// ✅ Trust proxy only in production
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // trust first proxy (e.g., Heroku, NGINX)
}

// Implement CORS
// Implement CORS
app.use(cors({
  origin: true, // or specify your frontend URL e.g., 'http://localhost:3000'
  credentials: true
}));
// Security HTTP headers
// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:", "*"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'", "blob:"],
        frameSrc: ["'self'", "blob:"], // Add this for PDFs
        frameAncestors: ["'self'", "http://localhost:5173"] // Allow framing from your frontend
      }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ✅ Rate limiting (Safe & configurable)
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
  skip: (req) => req.path === '/api/v1/health'
});
app.use("/api", limiter);

// Body parser
app.use(json({ limit: "10kb" }));
app.use(urlencoded({ extended: true, limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use((req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = domPurify.sanitize(req.body[key]);
      }
    }
  }
  next();
});

// Prevent parameter pollution
app.use(hpp({
  whitelist: [
    'duration', 'ratingsQuantity', 'ratingsAverage',
    'maxGroupSize', 'difficulty', 'price'
  ]
}));

// Compression
app.use(compression());

// Static files
// app.use(expressStatic(join(__dirname, "./uploads")));
// Static files
app.use('/ride_share_api/uploads', express.static(join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.pdf')) {
      res.set('Content-Type', 'application/pdf');
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
    // Keep your existing image headers
    if (path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
  }
}));

// Swagger docs
setupSwagger(app);

// Routes
app.use("/ride_share_api/", routes);

// Health check
app.get('/ride_share_api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});
app.post('/predict', (req, res) => {
    const inputData = req.body;

    // Validate input data
    if (!inputData || Object.keys(inputData).length === 0) {
        return res.status(400).json({ error: 'Invalid or empty input data' });
    }

    // Ensure all required fields are present
    const requiredFields = ['distance_km', 'trip_duration_min', 'time_of_day', 'day_of_week', 'demand_level'];
    const missingFields = requiredFields.filter(field => !(field in inputData));
    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });
    }

    // Log input data for debugging
    console.log('Received input:', inputData);
    const jsonInput = JSON.stringify(inputData);
    console.log('Sending to Python:', jsonInput);

    // Run Python script using child_process
    const pythonPath = 'C:\\Users\\santhosh rajan\\AppData\\Local\\Programs\\Python\\Python311\\python.exe';
    const escapedJsonInput = jsonInput.replace(/"/g, '\\"');
    const command = `"${pythonPath}" predict.py "${escapedJsonInput}"`;
    console.log('Executing command:', command);
    exec(command, { timeout: 30000, cwd: __dirname }, (err, stdout, stderr) => {
        if (err) {
            console.error('Exec error:', err);
            console.error('Python stderr:', stderr);
            return res.status(500).json({ error: 'Prediction failed', details: err.message, stderr });
        }
        try {
            console.log('Python stdout:', stdout);
            const lines = stdout.trim().split('\n');
            const jsonLine = lines.find(line => line.startsWith('{') && line.endsWith('}'));
            if (!jsonLine) {
                throw new Error('No valid JSON output found');
            }
            const result = JSON.parse(jsonLine);
            console.log('Parsed result:', result);
            res.json({ data: result });
        } catch (parseErr) {
            console.error('Parse error:', parseErr);
            console.error('Raw output:', stdout);
            res.status(500).json({ error: 'Failed to parse prediction result', details: parseErr.message, rawOutput: stdout });
        }
    });
});
// Handle 404
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// Global error handler
app.use(globalErrorHandler);

export default app;