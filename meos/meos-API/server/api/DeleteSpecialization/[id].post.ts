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

    const specialization = await meosPool.query('SELECT * FROM specializations WHERE id = ?', [id]);
    if (!specialization[0]) {
      event.node.res.statusCode = 400;
      return { message: 'Specialization not found' };
    }

    await meosPool.query('DELETE FROM specializations WHERE id = ?', [id]);

    return { message: 'Specialization deleted' };
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});