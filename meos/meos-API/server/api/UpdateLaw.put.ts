import { meosPool } from "../utils/db";
import { authenticate } from "../utils/auth";

export default defineEventHandler(async (event) => {
  const { id, title, description, category, prison, prisontype, fine, active } = await readBody(event);
  const user = await authenticate(event);
  
  if (!user || (!user.serverAdmin && !user.meosAdmin)) {
    event.node.res.statusCode = 401;
    return { message: 'Unauthorized' };
  }

  if (!id || !title || !category) {
    event.node.res.statusCode = 400;
    return { message: 'ID, title and category are required' };
  }

  try {
    // Verify the law exists and belongs to the user's server
    const [existingLaw] = await meosPool.query(
      'SELECT * FROM laws WHERE id = ? AND belongsToServer = ?',
      [id, user.belongsToServer]
    );

    if (!existingLaw[0]) {
      event.node.res.statusCode = 404;
      return { message: 'Law not found' };
    }

    // Verify the law category exists and belongs to the user's server
    const [categoryExists] = await meosPool.query(
      'SELECT * FROM law_categories WHERE id = ? AND belongsToServer = ?',
      [category, user.belongsToServer]
    );

    if (!categoryExists[0]) {
      event.node.res.statusCode = 404;
      return { message: 'Law category not found' };
    }

    const [result] = await meosPool.query(
      'UPDATE laws SET title = ?, description = ?, category = ?, prison = ?, prisontype = ?, fine = ?, active = ? WHERE id = ? AND belongsToServer = ?',
      [title, description, category, prison, prisontype, fine, active ? 1 : 0, id, user.belongsToServer]
    );

    return {
      message: 'Law updated successfully',
      result
    };

  } catch (error) {
    console.error('Error updating law:', error);
    event.node.res.statusCode = 500;
    return { message: 'Failed to update law' };
  }
}); 