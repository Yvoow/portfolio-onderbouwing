import { meosPool } from "~/utils/db";
import { authenticate } from "~/utils/auth";
import * as mysql from 'mysql2/promise';
import { addToHistory } from "~/utils/serverHistory";

export default defineEventHandler(async(event) => {

  try {
    const user = await authenticate(event);
    if (!user) {
      event.node.res.statusCode = 401;
      return { message: 'Unauthorized' };
    }

    const id = getRouterParam(event, 'id');
    if (!id) {
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

    const userdb = serverDB.userstable || 'users';
    const vehiclesdb = serverDB.ownedvehiclestable || 'owned_vehicles';
    const jobsdb = serverDB.jobstable || 'jobs';
    const selectColumns = [];

    if (userdb) {
      selectColumns.push([userdb.identifiercolumn ?? 'identifier', userdb.firstnamecolumn ?? 'firstname', userdb.lastnamecolumn ?? 'lastname', userdb.dateofbirthcolumn ?? 'dateofbirth', userdb.phonecolumn ?? 'phone_number', userdb.sexcolumn ?? 'sex', userdb.lengthcolumn ?? 'height', userdb.jobcolumn ?? 'job']);
    } else {
      selectColumns.push(['identifier', 'firstname', 'lastname', 'dateofbirth', 'phone_number', 'sex', 'height', 'job'])
    }
    
    const query = `SELECT ${selectColumns.join(',')} FROM ${userdb.name ?? 'users'} WHERE ${userdb.identifiercolumn} = '${id}'`;
    const [player] = await fivemPool.query(query);
    const playerData = player[0];
    if (!playerData) {
      event.node.res.statusCode = 404;
      return { message: 'Player not found' };
    }
      
    const vehselectColumns = [];
    if (vehiclesdb) {
      vehselectColumns.push(vehiclesdb.ownercolumn ?? 'owner', vehiclesdb.platecolumn ?? 'plate');
    } else {
      vehselectColumns.push('owner', 'plate');
    }
    const [vehicles] = await fivemPool.query(`SELECT ${vehselectColumns.join(', ')} FROM ${vehiclesdb.name} WHERE ${vehiclesdb.ownercolumn} = '${playerData[userdb.identifiercolumn]}'`);
    playerData.vehicles = vehicles;

    const job = await fivemPool.query(`SELECT ${jobsdb.labelcolumn ?? 'label'} FROM ${jobsdb.name ?? 'jobs'} WHERE ${jobsdb.namecolumn ?? 'name'} = '${playerData[userdb.jobcolumn]}'`);
    
    const structuredPlayer = {
      identifier: playerData[userdb.identifiercolumn],
      rpname: playerData[userdb.firstnamecolumn] ? `${playerData[userdb.firstnamecolumn]} ${playerData[userdb.lastnamecolumn]}` : `Onbekend (geen naam)`,
      dateofbirth: playerData[userdb.dateofbirthcolumn],
      phone: playerData[userdb.phonecolumn],
      sex: playerData[userdb.sexcolumn],
      height: playerData[userdb.lengthcolumn],
      job: job[0][jobsdb.labelcolumn],
      vta: false,
      vehicles: playerData.vehicles,
    };

    // Check if player has any open arrest warrants
    const [openWarrants] = await meosPool.query(
      'SELECT * FROM reports WHERE type = ? AND status = ? AND suspect = ? AND belongsToServer = ?',
      ['Arrestatiebevel', 'open', structuredPlayer.identifier, user.belongsToServer]
    );
    
    structuredPlayer.vta = (openWarrants as any[]).length > 0;

    // await addToHistory(user.belongsToServer, 'player', structuredPlayer.rpname, `Opgevraagd door ${user.name}`);
    return structuredPlayer;
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});