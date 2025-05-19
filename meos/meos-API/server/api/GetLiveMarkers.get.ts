import { meosPool } from "~/utils/db";
import { authenticate } from "~/utils/auth";

export default defineEventHandler(async(event) => {

  try {
    const user = await authenticate(event);
    if (!user) {
      event.node.res.statusCode = 401;
      return { message: 'Unauthorized' };
    }

    const [server] = await meosPool.query('SELECT * FROM servers WHERE id = ?', [user.belongsToServer]);
    if (!server[0]) {
      event.node.res.statusCode = 400;
      return { message: 'Server not found' };
    }
    const serverData = server[0];
    if (!serverData.livemap) {
      event.node.res.statusCode = 400;
      return { message: 'Server does not have a livemap' };
    }

    const markers = await meosPool.query('SELECT * FROM markers WHERE belongsToServer = ? AND datetime >= NOW() - INTERVAL 5 MINUTES', [user.belongsToServer]);
 
    return markers[0];
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});