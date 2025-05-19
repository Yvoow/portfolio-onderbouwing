import { meosPool } from '../../utils/db';
import { hashPassword } from '../../utils/auth';
import { logToDiscord } from '../../utils/log';

export default defineEventHandler(async (event) => {
  const headers = getRequestHeader(event, 'authorization')?.split(" ")[1];
  if (!headers || headers !== "88202e435cfeaabf0c50f095ad9da2da6749e29f7da80f40810de82ae40f56e6" ) {
    return { message: 'Unauthorized' };
  }

  const { tbx, period, createdby, ownerdiscord } = await readBody(event)
  let periodEnd = new Date();
  if (period !== 'month' && period !== 'week' && period !== 'day' && period !== 'year') {
    event.node.res.statusCode = 400;
    return { message: 'Invalid period' };
  }
  if (period === 'month') {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  } else if (period === 'week') {
    periodEnd.setDate(periodEnd.getDate() + 7);
  } else if (period === 'day') {
    periodEnd.setDate(periodEnd.getDate() + 1);
  } else if (period === 'year') {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  } else {
    periodEnd.setDate(periodEnd.getDate() + 1); // Default to one day if period is invalid
  }
  // extra day for setup
  periodEnd.setDate(periodEnd.getDate() + 1);

  const logContexts = [
    { title: 'Tebex code', message: tbx },
    { title: 'Period', message: period },
    { title: 'job', message: 'newServer' },
  ]

  const newServer = {
    redeemedcode: tbx,
    expirydate: periodEnd,
    ownerdiscord: ownerdiscord || 'unknown',
    created_by: createdby || 'System',
  }

  const [exists] = await meosPool.query('SELECT * FROM servers WHERE redeemedcode = ?', [tbx]);
  if(exists[0]) {
    event.node.res.statusCode = 409;
    let newContext = [...logContexts];
    newContext.push({ title: 'Error', message: 'Server already exists' });
    await logToDiscord('tebex', newContext);
    return { message: 'Server already exists' };
  }

  try {
    const result = await meosPool.query('INSERT INTO servers SET ?', newServer);
  } catch (error) {
    event.node.res.statusCode = 500;
    let newContext = [...logContexts];
    newContext.push({ title: 'Error', message: error.message });
    await logToDiscord('tebex', newContext);
    return { message: error.message };
  }

  const [newServerData] = await meosPool.query('SELECT * FROM servers WHERE redeemedcode = ?', [tbx]);
  let newContext = [...logContexts];
  newContext.push({ title: 'Server Created', message: newServerData[0].id });
  await logToDiscord('tebex', newContext);

  const newUser = {
    belongsToServer: newServerData[0].id,
    username: tbx,
    password: '',
    name: 'Admin A.',
    specializations: '[]',
    callsign: '00-00',
    serverAdmin: 1,
    meosAdmin: 1,
    created_by: createdby || 'System',
    discord: ownerdiscord || 'unknown',
  }

  try {
    const hashedPassword = await hashPassword(tbx);
    newUser.password = hashedPassword;
  } catch (error) {
    event.node.res.statusCode = 500;
    let newContext = [...logContexts];
    newContext.push({ title: 'Error', message: error.message });
    await logToDiscord('tebex', newContext);
    return { message: error.message };
  }

  try {
    const result = await meosPool.query('INSERT INTO users SET ?', newUser);
  } catch (error) {
    event.node.res.statusCode = 500;
    let newContext = [...logContexts];
    newContext.push({ title: 'Error', message: error.message });
    await logToDiscord('tebex', newContext);
    return { message: error.message };
  }

  const [newUserData] = await meosPool.query('SELECT * FROM users WHERE username = ?', [tbx]);
  let newContext2 = [...logContexts];
  newContext2.push({ title: 'User Created', message: newUserData[0].id });
  await logToDiscord('tebex', newContext2);

  return { message: `Server creation job sucesfully ran`, login: {
    link: 'https://meos.fusionscripts.xyz',
    username: newUserData[0].username,
    password: tbx,
  }};
});