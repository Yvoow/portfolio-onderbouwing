import { meosPool } from "../utils/db";
import { authenticate } from "../utils/auth";

export default defineEventHandler(async (event) => {
  const { title, description, category, prison, fine, active } = await readBody(event);
  const user = await authenticate(event);
  
  if (!user || (!user.serverAdmin && !user.meosAdmin)) {
    event.node.res.statusCode = 401;
    return { message: 'Unauthorized' };
  }

  if (!title || !category) {
    event.node.res.statusCode = 400;
    return { message: 'Title and category are required' };
  }

  try {
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
      'INSERT INTO laws (id, title, description, category, prison, fine, active, belongsToServer, created_by) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, category, prison, fine, active ? 1 : 0, user.belongsToServer, user.id]
    );

    return {
      message: 'Law created successfully',
      result
    };

  } catch (error) {
    console.error('Error creating law:', error);
    event.node.res.statusCode = 500;
    return { message: 'Failed to create law' };
  }
}); 