import { meosPool } from "../../utils/db";
import { authenticate } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const user = await authenticate(event);
  
  if (!user || (!user.serverAdmin && !user.meosAdmin)) {
    event.node.res.statusCode = 401;
    return { message: 'Unauthorized' };
  }

  // Get law ID from URL parameters
  const lawId = event.context.params.id;

  if (!lawId) {
    event.node.res.statusCode = 400;
    return { message: 'Law ID is required' };
  }

  try {
    // Verify the law exists and belongs to the user's server
    const [existingLaw] = await meosPool.query(
      'SELECT * FROM laws WHERE id = ? AND belongsToServer = ?',
      [lawId, user.belongsToServer]
    );

    if (!existingLaw[0]) {
      event.node.res.statusCode = 404;
      return { message: 'Law not found' };
    }

    // Delete the law
    const [result] = await meosPool.query(
      'DELETE FROM laws WHERE id = ? AND belongsToServer = ?',
      [lawId, user.belongsToServer]
    );

    return {
      message: 'Law deleted successfully',
      result
    };

  } catch (error) {
    console.error('Error deleting law:', error);
    event.node.res.statusCode = 500;
    return { message: 'Failed to delete law' };
  }
}); 