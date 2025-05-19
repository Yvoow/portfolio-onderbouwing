import { meosPool } from "~/utils/db";
import { authenticate } from "~/utils/auth";

export default defineEventHandler(async(event) => {

  try {
    const user = await authenticate(event);
    if (!user) {
      event.node.res.statusCode = 401;
      return { message: 'Unauthorized' };
    }

    let query
    let params = []
    if (!user.serverAdmin && !user.meosAdmin) {
      query = 'SELECT id,name,callsign,role FROM users'
    } else {
      query = 'SELECT * FROM users'
    }

    if (!user.isDev) {
      query += ' WHERE belongsToServer = ?'
      params.push(user.belongsToServer)
    }

    const [count] = await meosPool.query(`SELECT COUNT(*) as count FROM (${query}) as users`, params)
    const rp = getRouterParams(event)
    if (rp.orderBy) {
      query += ` ORDER BY ${rp.orderBy}`
    }
    if (rp.order) {
      query += ` ${rp.order}`
    }
    if (rp.pageSize) {
      query += ` LIMIT ${rp.pageSize}`
    }
    if (rp.page) {
      const page = Number(rp.page) || 1;
      const pageSize = Number(rp.pageSize) || 0;
      if (page > 1) {
        query += ` OFFSET ${(page - 1) * pageSize}`
      }
    }
    
    const [users] = await meosPool.query(query, params)
    const restructuredUsers = await restructureUsers(users, user)
    return {
      data: restructuredUsers,
      total: count[0].count
    };
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});

async function restructureUsers(users, user) {
  let rolesquery = {
    query: 'SELECT * FROM roles',
    params: []
  }

  let specializationsquery = {
    query: 'SELECT * FROM specializations',
    params: []
  }

  if (!user.serverAdmin && !user.meosAdmin) {
    rolesquery.query += ' WHERE belongsToServer = ?'
    rolesquery.params.push(user.belongsToServer)
    specializationsquery.query += ' WHERE belongsToServer = ?'
    specializationsquery.params.push(user.belongsToServer)
  }

  const [roles] = await meosPool.query(rolesquery.query, rolesquery.params)
  const [specializations] = await meosPool.query(specializationsquery.query, specializationsquery.params)

  let restructuredUsers = []
  users.forEach(async (user) => {
    var restructuredUser = {
      id: user.id,
      belongsToServer: user.belongsToServer,
      name: user.name,
      username: user.username,
      callsign: user.callsign,
      serverAdmin: user.serverAdmin,
      meosAdmin: user.meosAdmin,
      role: roles.find(role => role.id === user.role)?.label,
      roleicon: roles.find(role => role.id === user.role) ? roles.find(role => role.id === user.role).icon : undefined,
      specializations: user.specializations ? user.specializations.map(specialization => specializations.find(s => s.id === specialization).label) : []
    }
    restructuredUsers.push(restructuredUser)
  })
  return restructuredUsers
}