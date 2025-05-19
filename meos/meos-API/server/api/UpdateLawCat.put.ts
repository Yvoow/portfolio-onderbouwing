import { meosPool } from "../utils/db";
import { authenticate } from "../utils/auth";

export default defineEventHandler(async (event) => {
  const { id, name, color } = await readBody(event);
  const user = await authenticate(event);
  
  if (!user || (!user.serverAdmin && !user.meosAdmin)) {
    event.node.res.statusCode = 401;
    return { message: 'Unauthorized' };
  }

  if (!id || !name || !color) {
    event.node.res.statusCode = 400;
    return { message: 'ID, name and color are required' };
  }

  try {
    const [existingCat] = await meosPool.query(
      'SELECT * FROM law_categories WHERE id = ?', 
      [id]
    );

    if (!existingCat[0]) {
      event.node.res.statusCode = 404;
      return { message: 'Law category not found' };
    }

    const [nameConflict] = await meosPool.query(
      'SELECT * FROM law_categories WHERE name = ? AND belongsToServer = ? AND id != ?', 
      [name, user.belongsToServer, id]
    );

    if (nameConflict[0]) {
      event.node.res.statusCode = 409;
      return { message: 'Another law category with this name already exists' };
    }

    const [result] = await meosPool.query(
      'UPDATE law_categories SET name = ?, color = ? WHERE id = ?',
      [name, color, id]
    );

    return { 
      message: 'Law category updated successfully',
      result
    };

  } catch (error) {
    console.error('Error updating law category:', error);
    event.node.res.statusCode = 500;
    return { message: 'Failed to update law category' };
  }
}); 