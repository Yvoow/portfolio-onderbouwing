import { meosPool } from "~/utils/db";
import { authenticate, generateToken } from "~/utils/auth";

export default defineEventHandler(async(event) => {

  try {
    const user = await authenticate(event);
    if (!user) {
      event.node.res.statusCode = 401;
      return { message: 'Unauthorized' };
    }

    const token = generateToken(user.id);
    if (!token) {
      event.node.res.statusCode = 500;
      return { message: 'Token generation failed' };
    }
    const [roleName] = await meosPool.query('SELECT * FROM roles WHERE id = ?', [user.role]);
    user.role = roleName[0]?.label;
    const [GPS] = await meosPool.query('SELECT * FROM gps WHERE belongsToUser = ?', [user.id]);
    user.GPS = GPS[0] ? GPS[0] : null;
    const servervars = await getServerVars(user.belongsToServer);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        belongsToServer: user.belongsToServer,
        role: user.role,
        roleicon: roleName[0] ? roleName[0].icon ?? undefined : undefined,
        serverAdmin: user.serverAdmin ? user.serverAdmin : false,
        meosAdmin: user.meosAdmin ? user.meosAdmin : false,
        callsign: user.callsign ? user.callsign : '00-00',
        specializations: user.specializations ? user.specializations : [],
        GPS: user.GPS ? user.GPS : null,
        language: user.language ? user.language : ''
      },
      servervars: servervars
    };
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});

async function getServerVars(serverId: string) {
  const [specializations] = await meosPool.query('SELECT * FROM specializations WHERE belongsToServer = ?', [serverId]);
  const [roles] = await meosPool.query('SELECT * FROM roles WHERE belongsToServer = ?', [serverId]);
  const [servermarkers] = await meosPool.query('SELECT * FROM markers WHERE belongsToServer = ?', [serverId]);
  const [server] = await meosPool.query('SELECT * FROM servers WHERE id = ?', [serverId]);
  const [serverhistory] = await meosPool.query('SELECT * FROM serverhistory WHERE belongsToServer = ?', [serverId]);
  return {
    specializations: specializations ?? [],
    roles: roles ?? [],
    markers: servermarkers ?? [],
    livemap: server[0].livemap ?? false,
    history: serverhistory ?? [],
    language: server[0].language ?? 'en'
  };
}