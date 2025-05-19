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
    const { label, desc } = body;
    if (!label || !desc) {
      event.node.res.statusCode = 400;
      return { message: 'Missing required fields' };
    }
    if (label.length > 16) {
      event.node.res.statusCode = 400;
      return { message: 'Label too long' };
    }

    const id = getRouterParam(event, 'id');
    const [specialization] = await meosPool.query('SELECT * FROM specializations WHERE id = ? AND belongsToServer = ?', [id, user.belongsToServer]);
    if (!specialization[0]) {
      event.node.res.statusCode = 404;
      return { message: 'Specialization not found' };
    }

    const updatedSpecialization = {
      ...specialization[0],
      label,
      desc,
    };
    await meosPool.query('UPDATE specializations SET ? WHERE id = ?', [updatedSpecialization, id]);
    return updatedSpecialization;
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});