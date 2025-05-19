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
    const vehiclesdb = serverDB.ownedvehiclestable;
    const selectColumns = [];
    if (vehiclesdb) {
      selectColumns.push(vehiclesdb.ownercolumn ?? 'owner', vehiclesdb.platecolumn ?? 'plate');
    } else {
      selectColumns.push('owner', 'plate');
    }

    let query = `SELECT ${selectColumns.join(', ')} FROM ${vehiclesdb.name ?? 'owned_vehicles'}`;
    const rp = getQuery(event);
    if (rp.wherePlate) {
      query += ` WHERE ${vehiclesdb.platecolumn} LIKE '%${rp.wherePlate}%'`;
    }

    const [count] = await fivemPool.query(`SELECT COUNT(*) as count FROM (${query}) as vehicles`);
    if (rp.orderBy) {
      query += ` ORDER BY LOWER(${rp.orderBy})`;
    }
    if (rp.order) {
      query += ` ${rp.order}`;
    }
    if (rp.perPage) {
      query += ` LIMIT ${rp.perPage}`;
    }
    if (rp.page) {
      const page = Number(rp.page) || 1;
      const perPage = Number(rp.perPage) || 0;
      if (page > 1) {
        query += ` OFFSET ${(page - 1) * perPage}`;
      }
    }
    const [vehicles] = await fivemPool.query(query);
    const [players] = await fivemPool.query(`SELECT * FROM ${serverDB.userstable.name ?? 'users'}`);
    const allVehicles = vehicles.map((vehicle: any) => ({
      ownerid: vehicle[vehiclesdb.ownercolumn],
      playername: players.find((player: any) => player.identifier === vehicle[vehiclesdb.ownercolumn])?.firstname + ' ' + players.find((player: any) => player.identifier === vehicle[vehiclesdb.ownercolumn])?.lastname,
      plate: vehicle[vehiclesdb.platecolumn],
    }));

    event.node.res.statusCode = 200;
    return {
      data: allVehicles,
      total: count[0].count
    };
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});