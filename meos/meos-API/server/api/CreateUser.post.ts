import { meosPool } from "~/utils/db";
import { authenticate, hashPassword } from "~/utils/auth";

export default defineEventHandler(async(event) => {

  try {
    const user = await authenticate(event);
    if (!user || (!user.meosAdmin && !user.serverAdmin)) {
      event.node.res.statusCode = 401;
      return { message: 'Unauthorized' };
    }

    const body = await readBody(event);
    const { name, callsign, role, username, meosAdmin, specializations } = body;
    if (!name || !callsign || !role || !username) {
      event.node.res.statusCode = 400;
      return { message: 'Missing required fields' };
    }
    if (name.length > 24 || username.length > 16 || callsign.length > 8) {
      event.node.res.statusCode = 400;
      return { message: 'Name, username or callsign too long' };
    }

    const [userExists] = await meosPool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (userExists[0]) {
      event.node.res.statusCode = 409;
      return { message: 'User already exists' };
    }

    const password = generatePassword(8);
    const hashedPassword = await hashPassword(password);

    const newUser = {
      belongsToServer: user.belongsToServer,
      name,
      callsign,
      role,
      username,
      meosAdmin,
      specializations: specializations.length > 0 ? JSON.stringify(specializations) : '[]',
      password: hashedPassword,
      created_by: user.id,
    }

    await meosPool.query('INSERT INTO users SET ?', [newUser]);

    return {
      ...newUser,
      password
    }
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});

function generatePassword(length: number) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}