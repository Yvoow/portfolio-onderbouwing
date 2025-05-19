import { meosPool } from "~/utils/db";
import { authenticate } from "~/utils/auth";

export default defineEventHandler( async (event) => {
  if (event.method !== "OPTIONS") {
    const user = await authenticate(event);
    await insertRecord(user, event);
  }
});
async function insertRecord(user: any, event: any) {
  const body = await readBody(event).catch(() => ({}));
  const { authorization } = getRequestHeaders(event) || {};
  const { method, url } = event;
  
  const path = getRequestURL(event);
  const query = getQuery(event);
  const params = getRouterParams(event);

  let record = {
    userID: user?.id || null,
    username: user?.username || null,
    endpoint: path ? path.pathname : null,
    method: method || '',
    body: body ? JSON.stringify(body) : null,
    query: query ? JSON.stringify(query) : null,
    params: params ? JSON.stringify(params) : null,
    authorization: user?.belongsToServer || 'unknown server',
    serverAdmin: user?.serverAdmin || false,
    meosAdmin: user?.meosAdmin || false,
    createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    type: 'api'
  }

  if (path && path.toString().includes('/login')) {
    record.type = 'login';
  }

  if (path && path.toString().includes('isLoggedIn')) {
    record.type = 'logincheck';
  }

  // filter out favicon requests and root requests
  if (path && path.toString() === '/' || path.toString().includes('favicon')) {
    return;
  }

  await meosPool.query('INSERT INTO logs (userID, username, endpoint, method, body, query, params, authorization, serverAdmin, meosAdmin, createdAt, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [record.userID, record.username, record.endpoint, record.method, record.body, record.query, record.params, record.authorization, record.serverAdmin, record.meosAdmin, record.createdAt, record.type]);  

  return record;
}
