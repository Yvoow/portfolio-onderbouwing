import { meosPool } from "~/utils/db";
import { comparePassword, generateToken } from "~/utils/auth";

export default defineEventHandler(async(event) => {
  const { username, password } = await readBody(event);
  if (!username || !password) {
    event.node.res.statusCode = 400;
    return { message: 'Missing username or password' };
  }

  try {
    const [users] = await meosPool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (!users[0]) {
      event.node.res.statusCode = 401;
      return { message: 'Invalid credentials' };
    }
    const user = users[0];
    const rightPassword = await comparePassword(password, user.password);
    if (!rightPassword) {
      event.node.res.statusCode = 401;
      return { message: 'Invalid credentials' };
    }

    const [server] = await meosPool.query('SELECT * FROM servers WHERE id = ?', [user.belongsToServer]);
    const currentDate = new Date();
    const serverExpiryDate = new Date(server[0].expirydate);
    if (currentDate > serverExpiryDate) {
      event.node.res.statusCode = 412;
      return { message: 'Server has expired' };
    }

    const [role] = await meosPool.query('SELECT * FROM roles WHERE id = ?', [user.role]);
    user.role = role[0]?.label;
    user.roleicon = role[0] ? role[0].icon ?? undefined : undefined;

    const token = generateToken(user.id);
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        belongsToServer: user.belongsToServer,
        role: user.role,
        serverAdmin: user.serverAdmin ? user.serverAdmin : false,
        meosAdmin: user.meosAdmin ? user.meosAdmin : false,
        callSign: user.callSign ? user.callSign : '00-00',
        specializations: user.specializations ? user.specializations : []
      }
     };
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: `An error occurred: ${error.message}` };
  }  
});