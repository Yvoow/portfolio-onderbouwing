import { meosPool } from "~/utils/db";
import { authenticate } from "~/utils/auth";

export default defineEventHandler(async(event) => {

  try {
    const user = await authenticate(event);
    if (!user || (!user.meosAdmin && !user.serverAdmin)) {
      event.node.res.statusCode = 401;
      return { message: 'Unauthorized' };
    }

    let selectColumns = [
      'id',
      'name',
      'language',
      'livemap',
      'markers'
    ]
    if (!user.serverAdmin) {
      const [serverData] = await meosPool.query('SELECT ?? FROM servers WHERE id = ?', [selectColumns, user.belongsToServer]);
      return serverData[0];
    } else {
      const [serverData] = await meosPool.query('SELECT * FROM servers WHERE id = ?', [user.belongsToServer]);
      return serverData[0];
    }
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});