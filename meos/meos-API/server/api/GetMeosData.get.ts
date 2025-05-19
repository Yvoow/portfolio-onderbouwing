import { meosPool } from "~/utils/db";
import { authenticate } from "~/utils/auth";

export default defineEventHandler(async(event) => {

  try {
    const user = await authenticate(event);
    if (!user || (!user.meosAdmin && !user.serverAdmin)) {
      event.node.res.statusCode = 401;
      return { message: 'Unauthorized' };
    }

    let [serverData] = await meosPool.query('SELECT id, name, livemap FROM servers WHERE id = ?', [user.belongsToServer]);

    if (!serverData[0]) {
      event.node.res.statusCode = 400;
      return { message: 'Server not found' };
    }

    return serverData[0];
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});