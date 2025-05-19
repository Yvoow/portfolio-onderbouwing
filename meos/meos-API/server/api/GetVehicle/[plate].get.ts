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

    const plate = getRouterParam(event, 'plate')?.replace(/%20/g, ' ')
    if (!plate) {
      event.node.res.statusCode = 400;
      return { message: 'Missing required fields' };
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

    const query = `SELECT ${selectColumns.join(', ')} FROM ${vehiclesdb.name ?? 'owned_vehicles'} WHERE ${vehiclesdb.platecolumn} = ?`;
    const [vehicles] = await fivemPool.query(query, [plate]);
    
    if (!vehicles[0]) {
      event.node.res.statusCode = 404;
      return { message: 'Vehicle not found' };
    }

    const vehicle = vehicles[0];
    const [players] = await fivemPool.query(`SELECT * FROM ${serverDB.userstable.name ?? 'users'} WHERE ${serverDB.userstable.identifiercolumn} = ?`, [vehicle[vehiclesdb.ownercolumn]]);
    
    const structuredVehicle = {
      ownerid: vehicle[vehiclesdb.ownercolumn],
      playername: players[0] ? `${players[0][serverDB.userstable.firstnamecolumn]} ${players[0][serverDB.userstable.lastnamecolumn]}` : 'Unknown',
      plate: vehicle[vehiclesdb.platecolumn],
      warrant: false, // TODO: Implement warrant system
      ownerwarrant: false, // TODO: Implement warrant system
    };

    return structuredVehicle;
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
}); 