import { meosPool } from "~/utils/db";
import { authenticate, generateToken } from "~/utils/auth";

export default defineEventHandler(async(event) => {

  try {
    const user = await authenticate(event);
    if (!user) {
      event.node.res.statusCode = 401;
      return { message: 'Unauthorized' };
    }

    const userid = getRouterParam(event, 'userid');
    if (!userid) {
      event.node.res.statusCode = 400;
      return { message: 'User ID is required' };
    }

    const [gps] = await meosPool.query(`SELECT * FROM gps WHERE belongsToUser = ?`, [userid]);
    if (!gps[0]) {
      const newGpsId = await generateNewId();
      const GPS = {
        belongsToServer: user.belongsToServer,
        GPSid: newGpsId,
        belongsToUser: userid,
        displayname: user.name + ' ' + user.callsign
      };
      const [newGPS] = await meosPool.query('INSERT INTO gps SET ?', [GPS]);
      if (!newGPS) {
        event.node.res.statusCode = 500;
        return { message: 'Failed to create new GPS' };
      }
      event.node.res.statusCode = 200;
      return newGpsId;
    }
    const newGpsId = await generateNewId();
    gps[0].GPSid = newGpsId;
    await meosPool.query('UPDATE gps SET GPSid = ? WHERE belongsToUser = ?', [newGpsId, userid]);
    event.node.res.statusCode = 200;
    return gps[0];
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});

async function generateNewId() {
  return Math.floor(Math.random() * 1000000).toString();
}