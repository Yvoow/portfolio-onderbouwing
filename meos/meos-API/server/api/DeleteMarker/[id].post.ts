import { meosPool } from "~/utils/db";
import { authenticate } from "~/utils/auth";

export default defineEventHandler(async(event) => {

  try {
    const user = await authenticate(event);
    if (!user || (!user.meosAdmin && !user.serverAdmin)) {
      event.node.res.statusCode = 401;
      return { message: 'Unauthorized' };
    }

    const id = getRouterParam(event, 'id');
    if (!id) {
      event.node.res.statusCode = 400;
      return { message: 'Missing required fields' };
    }

    const marker = await meosPool.query('SELECT * FROM markers WHERE id = ?', [id]);
    if (!marker[0]) {
      event.node.res.statusCode = 400;
      return { message: 'Marker not found' };
    }

    await meosPool.query('DELETE FROM markers WHERE id = ?', [id]);

    return { message: 'Marker deleted' };
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});