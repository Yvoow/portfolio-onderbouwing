import { meosPool } from "~/utils/db";
import { authenticate, hashPassword } from "~/utils/auth";

export default defineEventHandler(async(event) => {

  try {
    const user = await authenticate(event);
    if (!user) {
      event.node.res.statusCode = 401;
      return { message: 'Unauthorized' };
    }

    const { name, callSign, username, password, language } = await readBody(event);
    if (!name || !callSign || !username || !language) {
      event.node.res.statusCode = 400;
      return { message: 'Missing required fields' };
    }

    if (name.length > 24 || username.length > 16 || callSign.length > 8) {
      event.node.res.statusCode = 400;
      return { message: 'Name, username or callsign too long' };
    }

    try {

      const [userExists] = await meosPool.query('SELECT * FROM users WHERE username = ?', [username]);
      if (userExists[0] && userExists[0].id !== user.id) {
        event.node.res.statusCode = 409;
        return { message: 'Username already exists' };
      }

      const [userRecord] = await meosPool.query('SELECT * FROM users WHERE id = ?', [user.id]);
      if (!userRecord[0]) {
        event.node.res.statusCode = 404;
        return { message: 'User not found' };
      }
      const updatedUser = userRecord[0];

      updatedUser.name = name;
      updatedUser.callsign = callSign;
      updatedUser.username = username;
      updatedUser.language = language;
      if (password) {
        const hashedPassword = await hashPassword(password);
        updatedUser.password = hashedPassword;
      } else {
        updatedUser.password = userRecord[0].password;
      }

      await meosPool.query('UPDATE users SET name = ?, callsign = ?, username = ?, password = ?, language = ? WHERE id = ?', [updatedUser.name, updatedUser.callsign, updatedUser.username, updatedUser.password, updatedUser.language, updatedUser.id]);
      return updatedUser;
    } catch (error) {
      event.node.res.statusCode = 500;
      return { message: error.message };
    }
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});