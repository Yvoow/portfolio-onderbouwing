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
    const { name, role, meosAdmin, username, callsign, specializations } = body;
    // if (!name || !role || !username || !callsign) {
    //   event.node.res.statusCode = 400;
    //   return { message: 'Missing required fields' };
    // }
    if (name.length > 24 || username.length > 16 || callsign.length > 8) {
      event.node.res.statusCode = 400;
      return { message: 'Name, username or callsign too long' };
    }

    const id = getRouterParam(event, 'userid');
    if (!id) {
      event.node.res.statusCode = 400;
      return { message: 'Missing required fields' };
    }
    const [userExists] = await meosPool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (userExists[0] && userExists[0].id !== id) {
      event.node.res.statusCode = 409;
      return { message: 'Username already exists' };
    }

    const [userRecord] = await meosPool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (!userRecord[0]) {
      event.node.res.statusCode = 404;
      return { message: 'User not found' };
    }
    const updatedUser = userRecord[0];
    updatedUser.name = name || updatedUser.name;
    updatedUser.role = role || updatedUser.role;
    updatedUser.specializations = specializations ? JSON.stringify(specializations) : updatedUser.specializations || '[]';
    updatedUser.meosAdmin = meosAdmin || updatedUser.meosAdmin;
    updatedUser.username = username || updatedUser.username;
    updatedUser.callsign = callsign || updatedUser.callsign;

    // await meosPool.query('UPDATE users SET name = ?, role = ?, meosAdmin = ?, username = ?, callsign = ?, specializations = ? WHERE id = ?', [updatedUser.name, updatedUser.role, updatedUser.meosAdmin, updatedUser.username, updatedUser.callsign, updatedUser.specializations, id]);
    await meosPool.query('UPDATE users SET ? WHERE id = ?', [updatedUser, id]);
    return updatedUser;
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});