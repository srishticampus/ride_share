//server/src/utils/jwt.js
import jwt from 'jsonwebtoken';
import config from '../config/env.config.js';

const { sign } = jwt;

// Only include user ID in token
export function signToken(id) {
  return sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
}

export function createSendToken(user, statusCode, res) {
  const token = signToken(user._id); // No role in token
  
  const cookieOptions = {
    expires: new Date(
      Date.now() + config.jwt.cookieExpiresIn * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (config.env === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
}