import { meosPool } from "~/utils/db";
import { authenticate, generateToken } from "~/utils/auth";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const user = await authenticate(event);
  if (!user || (!user.serverAdmin && !user.meosAdmin)) {
    event.node.res.statusCode = 401;
    return { message: 'Unauthorized' };
  }

  try {
    const [userToDelete] = await meosPool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (!userToDelete[0]) {
      event.node.res.statusCode = 404;
      return { message: 'User not found' };
    }

    if (userToDelete[0].belongsToServer !== user.belongsToServer) {
      event.node.res.statusCode = 403;
      return { message: 'You are not allowed to delete this user' };
    }

    await meosPool.query('DELETE FROM users WHERE id = ?', [id]);
    return { message: 'User deleted successfully' };
  } catch (error) {
    console.error('Error deleting user:', error);
    event.node.res.statusCode = 500;
    return { message: 'Internal server error' };
  }
});
