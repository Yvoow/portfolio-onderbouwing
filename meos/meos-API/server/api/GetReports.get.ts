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

    const params = getRouterParams(event);

    let query = 'SELECT * FROM reports WHERE belongsToServer = ?';
    let values = [user.belongsToServer];

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

    const userdb = serverDB.userstable;
    const selectColumns = [];
    if (userdb) {
      selectColumns.push([userdb.identifiercolumn ?? 'identifier', userdb.firstnamecolumn ?? 'firstname', userdb.lastnamecolumn ?? 'lastname']);
    } else {
      selectColumns.push(['identifier', 'firstname', 'lastname']);
    }
    
    if (params.whereUser) {
      query += ` AND c.suspect = ?`;
      values.push(params.whereUser);
    }

    if (params.whereID) {
      query += ` AND id = ?`;
      values.push(params.whereID);
    }

    if (params.whereTitle) {
      query += ` AND title LIKE ?`;
      values.push(`%${params.whereTitle}%`);
    }

    const [count] = await meosPool.query(`SELECT COUNT(*) as count FROM (${query}) as reports`, values);

    if (params.orderBy) {
      query += ` ORDER BY ${params.orderBy}`;
    }
    if (params.order) {
      query += ` ${params.order}`;
    }
    if (params.pageSize) {
      query += ` LIMIT ${params.pageSize}`;
    }
    
    if (params.page) {
      const page = Number(params.page) || 1;
      const pageSize = Number(params.pageSize) || 0;
      if (page > 1) {
        query += ` OFFSET ${(page - 1) * pageSize}`;
      }
    }

    const [reports] = await meosPool.query(query, values);    
    const [users] = await meosPool.query('SELECT * FROM users WHERE belongsToServer = ?', [user.belongsToServer]);
    const [players] = await fivemPool.query(`SELECT ${selectColumns.join(',')} FROM ${userdb.name ?? 'users'}`);

    reports.map(report => {
      const user = users.find(u => u.id === report.created_by);
      report.authorname = user.name;
      const player = players.find(p => p[userdb.identifiercolumn ?? 'identifier'] === report.suspect);
      report.playerName = player[userdb.firstnamecolumn ?? 'firstname'] + ' ' + player[userdb.lastnamecolumn ?? 'lastname'];
    });

    return {
      data: reports,
      total: count[0].count
    };
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});