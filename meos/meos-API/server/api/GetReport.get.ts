import { meosPool } from "~/utils/db";
import { authenticate } from "~/utils/auth";
import * as mysql from 'mysql2/promise';
export default defineEventHandler(async(event) => {

  try {
    const user = await authenticate(event);
    if (!user) {
      event.node.res.statusCode = 401;
      return { message: 'Unauthorized' };
    }

    const [server] = await meosPool.query('SELECT * FROM servers WHERE id = ?', [user.belongsToServer]);
    if (!server[0]) {
      event.node.res.statusCode = 400;
      return { message: 'Server not found' };
    }

    const serverDB = server[0].database;
    const fivemPool = mysql.createPool({
      host: serverDB.host || 'localhost',
      user: serverDB.user || 'root',
      password: serverDB.password || '',
      database: serverDB.database || 'essentialmode',
    });
    const userdb = serverDB.userstable || 'users';

    const selectColumns = [];
    if (userdb) {
      selectColumns.push([userdb.identifiercolumn ?? 'identifier', userdb.firstnamecolumn ?? 'firstname', userdb.lastnamecolumn ?? 'lastname']);
    } else {
      selectColumns.push(['identifier', 'firstname', 'lastname']);
    }

    const { id } = await getQuery(event);
    const [report] = await meosPool.query('SELECT * FROM reports WHERE id = ? AND belongsToServer = ?', [id, user.belongsToServer]);
    if (!report[0]) {
      event.node.res.statusCode = 404;
      return { message: 'Report not found' };
    }

    const [playerName] = await fivemPool.query(`SELECT ${selectColumns.join(',')} FROM ${userdb.name ?? 'users'} WHERE ${userdb.identifiercolumn ?? 'identifier'} = ?`, [report[0].suspect]);
    report[0].suspectName = playerName[0][userdb.firstnamecolumn ?? 'firstname'] + ' ' + playerName[0][userdb.lastnamecolumn ?? 'lastname'];

    const [author] = await meosPool.query('SELECT * FROM users WHERE id = ?', [report[0].officer]);
    report[0].authorName = author[0]?.name;

    return report[0];
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});