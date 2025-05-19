import { meosPool } from "~/utils/db";
import { authenticate, generateToken } from "~/utils/auth";

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

    const newMarker = {
      title: title,
      desc: desc,
      type: type,
      x: x,
      y: y,
      circleRadius: circleRadius ?? 0,
      created_by: user.id,
      belongsToServer: user.belongsToServer,
      color: color
    };
    if (circleRadius) {
      newMarker['circleRadius'] = circleRadius;
      if (color) {
        newMarker['color'] = color;
      }
    }

    await meosPool.query('INSERT INTO markers SET ?', [newMarker]);

    return newMarker;
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});