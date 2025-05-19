import { meosPool } from "../utils/db";
import { authenticate } from "../utils/auth";

export default defineEventHandler(async (event) => {
  const user = await authenticate(event);
  
  if (!user || (!user.serverAdmin && !user.meosAdmin)) {
    event.node.res.statusCode = 401;
    return { message: 'Unauthorized' };
  }

  try {
    // Get laws with category names using a JOIN
    const [laws] = await meosPool.query(
      `SELECT 
        l.*,
        c.name as categoryName,
        c.color as categoryColor
      FROM laws l
      LEFT JOIN law_categories c ON l.category = c.id
      WHERE l.belongsToServer = ?
      ORDER BY l.title ASC`,
      [user.belongsToServer]
    );

    return laws;

  } catch (error) {
    console.error('Error fetching laws:', error);
    event.node.res.statusCode = 500;
    return { message: 'Failed to fetch laws' };
  }
}); 