import { meosPool } from "../../utils/db";
import { authenticate } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const user = await authenticate(event);
  
  if (!user || (!user.serverAdmin && !user.meosAdmin)) {
    event.node.res.statusCode = 401;
    return { message: 'Unauthorized' };
  }

  // Get category ID from URL parameters
  const categoryId = event.context.params.id;

  if (!categoryId) {
    event.node.res.statusCode = 400;
    return { message: 'Category ID is required' };
  }

  try {
    // Verify the category exists and belongs to the user's server
    const [existingCategory] = await meosPool.query(
      'SELECT * FROM law_categories WHERE id = ? AND belongsToServer = ?',
      [categoryId, user.belongsToServer]
    );

    if (!existingCategory[0]) {
      event.node.res.statusCode = 404;
      return { message: 'Category not found' };
    }

    // Delete all laws belonging to this category
    const [deletedLaws] = await meosPool.query(
      'DELETE FROM laws WHERE category = ? AND belongsToServer = ?',
      [categoryId, user.belongsToServer]
    );

    // Delete the category
    const [result] = await meosPool.query(
      'DELETE FROM law_categories WHERE id = ? AND belongsToServer = ?',
      [categoryId, user.belongsToServer]
    );

    return {
      message: 'Category deleted successfully along with all associated laws',
      categoryResult: result,
      lawsDeleted: deletedLaws[0]?.affectedRows || 0
    };

  } catch (error) {
    console.error('Error deleting law category:', error);
    event.node.res.statusCode = 500;
    return { message: 'Failed to delete category' };
  }
}); 