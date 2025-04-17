//server/src/utils/jwt.js
import jwt from 'jsonwebtoken';
import config from '../config/env.config.js';

const { sign } = jwt;

export function signToken(id, role) {
  return sign({ id, role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
}

export function createSendToken(user, statusCode, res) {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + config.jwt.cookieExpiresIn * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (config.env === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
}
