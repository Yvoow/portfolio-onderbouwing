import { meosPool } from "~/utils/db";
import { authenticate } from "~/utils/auth";

export default defineEventHandler(async(event) => {

  try {
    const user = await authenticate(event);
    if (!user || (!user.meosAdmin && !user.serverAdmin)) {
      event.node.res.statusCode = 401;
      return { message: 'Unauthorized' };
    }

    const userId = getRouterParam(event, 'userid');
    if (!userId) {
      event.node.res.statusCode = 400;
      return { message: 'User ID is required' };
    }

    const [userRecord] = await meosPool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (!userRecord[0]) {
      event.node.res.statusCode = 404;
      return { message: 'User not found' };
    }

    return userRecord[0];
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});
