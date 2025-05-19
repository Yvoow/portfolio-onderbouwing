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

    const role = await meosPool.query('SELECT * FROM roles WHERE id = ?', [id]);
    if (!role[0]) {
      event.node.res.statusCode = 400;
      return { message: 'Role not found' };
    }

    await meosPool.query('DELETE FROM roles WHERE id = ?', [id]);

    return { message: 'Role deleted' };
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});