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
app.use(cors());
app.options("*", cors());

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"]
      }
    }
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
app.use(expressStatic(join(__dirname, "./uploads")));

// Swagger docs
setupSwagger(app);

// Routes
app.use("/api/v1", routes);

// Health check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

// Handle 404
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// Global error handler
app.use(globalErrorHandler);

export default app;
