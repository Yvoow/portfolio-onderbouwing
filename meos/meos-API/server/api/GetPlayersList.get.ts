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

    const routerparams = getQuery(event);
    
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
      selectColumns.push([userdb.identifiercolumn ?? 'identifier', userdb.firstnamecolumn ?? 'firstname', userdb.lastnamecolumn ?? 'lastname', userdb.dateofbirthcolumn ?? 'dateofbirth', userdb.phonecolumn ?? 'phone_number', userdb.sexcolumn ?? 'sex', userdb.lengthcolumn ?? 'height'])
    } else {
      selectColumns.push(['identifier', 'firstname', 'lastname', 'dateofbirth', 'phone_number', 'sex', 'height'])
    }

    let query = `SELECT ${selectColumns.join(',')} FROM ${userdb.name ?? 'users'}`;
    if (routerparams.whereName) {
      query += ` WHERE LOWER(${userdb.firstnamecolumn}) LIKE LOWER('%${routerparams.whereName}%') OR LOWER(${userdb.lastnamecolumn}) LIKE LOWER('%${routerparams.whereName}%') OR LOWER(CONCAT(${userdb.firstnamecolumn}, ' ', ${userdb.lastnamecolumn})) LIKE LOWER('%${routerparams.whereName}%')`;
    };
    if (routerparams.orderBy) {
      switch (routerparams.orderBy) {
        case 'name':
          query += ` ORDER BY LOWER(${userdb.firstnamecolumn})`;
          break;
        case 'dateofbirth':
          query += ` ORDER BY LOWER(${userdb.dateofbirthcolumn})`;
          break;
        case 'phone':
          query += ` ORDER BY LOWER(${userdb.phonecolumn})`;
          break;
      }
    }
    if (routerparams.order) {
      query += ` ${routerparams.order}`;
    }
    if (routerparams.perPage) {
      query += ` LIMIT ${routerparams.perPage}`;
    }
    if (routerparams.page) {
      const page = Number(routerparams.page) || 1;
      const pageSize = Number(routerparams.perPage) || 0;
      if (page > 1) {
        query += ` OFFSET ${(page - 1) * pageSize}`;
      }
    }
    const [players] = await fivemPool.query(query);
    const count = await fivemPool.query(`SELECT COUNT(*) FROM ${userdb.name ?? 'users'}`);

    const allPlayers = (players as any[]).map((player: any) => ({
      identifier: player[userdb.identifiercolumn],
      rpname: player[userdb.firstnamecolumn] ? `${player[userdb.firstnamecolumn]} ${player[userdb.lastnamecolumn]}` : `Onbekend (geen naam)`,
      dateofbirth: player[userdb.dateofbirthcolumn],
      phone: player[userdb.phonecolumn],
      sex: player[userdb.sexcolumn],
      height: player[userdb.lengthcolumn],
      vta: false,
    }));

    // Get all open arrest warrants
    const [openWarrants] = await meosPool.query(
      'SELECT suspect FROM reports WHERE type = ? AND status = ? AND belongsToServer = ?',
      ['Arrestatiebevel', 'open', user.belongsToServer]
    );

    // Create a set of identifiers with open warrants for faster lookup
    const openWarrantIdentifiers = new Set((openWarrants as any[]).map((warrant: any) => warrant.suspect));

    // Update vta status for each player
    allPlayers.forEach(player => {
      player.vta = openWarrantIdentifiers.has(player.identifier);
    });

    return {
      data: allPlayers,
      total: count[0][0]['COUNT(*)']
    }
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});
