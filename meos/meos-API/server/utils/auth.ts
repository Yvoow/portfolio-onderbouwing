import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { meosPool } from './db';

export const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '12h',
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const decodeToken = (token: string) => {
  return jwt.decode(token);
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
}

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
}

export const authenticate = async (event) => {
  try {
    const token = getRequestHeader(event, 'authorization')?.split(" ")[1];
    if (!token) return false;
    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return false;
    }
    const [result] = await meosPool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
    if (!result[0]) {
      return false;
    }
    const user = result[0];
    return user;
  } catch (error) {
    return false;
  }
}