import { meosPool } from "~/utils/db";
import { authenticate } from "~/utils/auth";

export default defineEventHandler(async(event) => {

  try {
    const user = await authenticate(event);
    if (!user) {
      event.node.res.statusCode = 401;
      return { message: 'Unauthorized' };
    }

    const [reports] = await meosPool.query(`
      SELECT r.*, u.name as creatorName FROM reports r
      LEFT JOIN users u on r.created_by = u.id
      WHERE r.belongsToServer = ?
      ORDER BY r.created_at DESC LIMIT 3
      `, [user.belongsToServer]);
    
    const [totalReports] = await meosPool.query('SELECT COUNT(*) as totalReports FROM reports WHERE belongsToServer = ?', [user.belongsToServer]);

    return {
      reports: reports,
      vtas: [],
      totalReports: totalReports[0].totalReports,
      totalPunishments: 0,
    }
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});