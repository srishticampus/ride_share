// server/src/config/env.config.js
import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(4040),
  MONGO_URI: Joi.string()
    .default('mongodb://localhost:27017/ride_share')
    .description('Mongo DB connection string'),
  JWT_SECRET: Joi.string()
    .default('default-jwt-secret-key-for-development')
    .description('JWT secret key'),
  JWT_EXPIRES_IN: Joi.string()
    .default('90d')
    .description('JWT expiration time'),
  JWT_COOKIE_EXPIRES_IN: Joi.number()
    .default(90)
    .description('JWT cookie expiration time in days'),
  UPLOAD_LIMIT: Joi.number()
    .default(5)
    .description('File upload limit in MB'),
  RATE_LIMIT_WINDOW: Joi.number()
    .default(60)
    .description('Rate limit window in minutes'),
  RATE_LIMIT_MAX: Joi.number()
    .default(100)
    .description('Rate limit max requests per window')
}).unknown();

const { value: envVars, error } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Export individual variables with fallbacks
export const NODE_ENV = envVars.NODE_ENV || 'development';
export const PORT = envVars.PORT || 4040;
export const MONGO_URI = envVars.MONGO_URI || 'mongodb://localhost:27017/RideShare';
export const JWT_SECRET = envVars.JWT_SECRET || 'default-jwt-secret-key-for-development';
export const JWT_EXPIRES_IN = envVars.JWT_EXPIRES_IN || '90d';
export const JWT_COOKIE_EXPIRES_IN = envVars.JWT_COOKIE_EXPIRES_IN || 90;
export const UPLOAD_LIMIT = (envVars.UPLOAD_LIMIT || 5) * 1024 * 1024; // Convert to bytes
export const RATE_LIMIT_WINDOW = (envVars.RATE_LIMIT_WINDOW || 60) * 60 * 1000; // Convert to ms
export const RATE_LIMIT_MAX = envVars.RATE_LIMIT_MAX || 100;

// Export mongoose config separately
export const mongooseConfig = {
  url: MONGO_URI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,pm2 
    serverSelectionTimeoutMS: 5000
  }
};

// Export jwt config separately
export const jwtConfig = {
  secret: JWT_SECRET,
  expiresIn: JWT_EXPIRES_IN,
  cookieExpiresIn: JWT_COOKIE_EXPIRES_IN
};

// Export rate limit config separately
export const rateLimitConfig = {
  window: RATE_LIMIT_WINDOW,
  max: RATE_LIMIT_MAX
};

// Default export for backward compatibility
const config = {
  env: NODE_ENV,
  port: PORT,
  mongoose: mongooseConfig,
  jwt: jwtConfig,
  uploadLimit: UPLOAD_LIMIT,
  rateLimit: rateLimitConfig
};

export default config;