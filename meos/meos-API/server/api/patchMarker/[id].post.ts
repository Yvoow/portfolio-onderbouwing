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
    const { title, desc, type, x, y, circleRadius, color } = body;
    if (!title || !desc || !type || !x || !y) {
      event.node.res.statusCode = 400;
      return { message: 'Missing required fields' };
    }

    if (title.length > 12 || circleRadius > 400) {
      event.node.res.statusCode = 400;
      return { message: 'Title too long or radius too big' };
    }

    const id = getRouterParam(event, 'id');
    const [marker] = await meosPool.query('SELECT * FROM markers WHERE id = ? AND belongsToServer = ?', [id, user.belongsToServer]);
    if (!marker[0]) {
      event.node.res.statusCode = 404;
      return { message: 'Marker not found' };
    }

    const updatedMarker = {
      ...marker[0],
      title,
      desc,
      type,
      x,
      y,
    };
    if(circleRadius) {
      updatedMarker.circleRadius = circleRadius;
    }
    if(color) {
      updatedMarker.color = color;
    }

    await meosPool.query('UPDATE markers SET ? WHERE id = ?', [updatedMarker, id]);
    return updatedMarker;
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});