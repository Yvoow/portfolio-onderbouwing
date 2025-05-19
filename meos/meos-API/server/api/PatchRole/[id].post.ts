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
    const { icon, label } = body;
    if (!icon || !label) {
      event.node.res.statusCode = 400;
      return { message: 'Missing required fields' };
    }
    if (label.length > 16) {
      event.node.res.statusCode = 400;
      return { message: 'Label too long' };
    }

    const id = getRouterParam(event, 'id');
    const [role] = await meosPool.query('SELECT * FROM roles WHERE id = ? AND belongsToServer = ?', [id, user.belongsToServer]);
    if (!role[0]) {
      event.node.res.statusCode = 404;
      return { message: 'Role not found' };
    }

    const updatedRole = {
      ...role[0],
      icon,
      label,
      edited_by: user.id,
    };

    await meosPool.query('UPDATE roles SET icon = ?, label = ?, edited_by = ? WHERE id = ?', [icon, label, user.id, id]);
    return updatedRole;
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});