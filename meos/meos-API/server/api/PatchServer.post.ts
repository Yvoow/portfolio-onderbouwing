import { meosPool } from "~/utils/db";
import { authenticate, hashPassword } from "~/utils/auth";

export default defineEventHandler(async(event) => {

  try {
    const user = await authenticate(event);
    if (!user || (!user.meosAdmin && !user.serverAdmin)) {
      event.node.res.statusCode = 401;
      return { message: 'Unauthorized' };
    }

    const [server] = await meosPool.query('SELECT * FROM servers WHERE id = ?', [user.belongsToServer]);
    if (!server) {
      event.node.res.statusCode = 404;
      return { message: 'Server not found' };
    }

    const body = await readBody(event);
    const { name, language, database } = body;
    if (name.length > 24) {
      event.node.res.statusCode = 400;
      return { message: 'Name too long' };
    }

    const serverData = server[0];
    const newname = name || serverData.name;
    const newlanguage = language || serverData.language;
    const newdb = database && Object.keys(database).length > 0 ? database : serverData.database;

    await meosPool.query('UPDATE servers SET name = ?, language = ?, `database` = ? WHERE id = ?', [newname, newlanguage, JSON.stringify(newdb), serverData.id]);
    return { message: 'Server updated' };
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});