import { meosPool } from "~/utils/db";
import { authenticate } from "~/utils/auth";

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

    const newRole = {
      label: label,
      icon: icon,
      created_by: user.id,
      belongsToServer: user.belongsToServer,
    }

    await meosPool.query('INSERT INTO roles SET ?', [newRole]);

    return newRole;
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});