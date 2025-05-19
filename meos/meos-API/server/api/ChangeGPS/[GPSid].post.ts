import { meosPool } from "~/utils/db";
import { authenticate, generateToken } from "~/utils/auth";

export default defineEventHandler(async(event) => {

  try {
    const GPSid = getRouterParam(event, 'GPSid');
    if (!GPSid) {
      event.node.res.statusCode = 400;
      return { message: 'GPS ID is required' };
    }

    const { x, y } = await readBody(event);
    if (!x || !y) {
      event.node.res.statusCode = 400;
      return { message: 'x and y are required' };
    }

    const [gps] = await meosPool.query(`SELECT * FROM gps WHERE GPSid = ?`, [GPSid]);
    if (!gps) {
      event.node.res.statusCode = 404;
      return { message: 'GPS not found' };
    }

    // WIP: Update the GPS record with the new x and y values


    return { message: 'GPS updated endpoint is a WIP' };
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }

});