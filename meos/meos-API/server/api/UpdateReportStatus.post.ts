import { meosPool } from "~/utils/db";
import { authenticate } from "~/utils/auth";

export default defineEventHandler(async(event) => {
  try {
    const user = await authenticate(event);
    if (!user) {
      event.node.res.statusCode = 401;
      return { message: 'Unauthorized' };
    }

    const { id, status } = await readBody(event);
    if (!id || !status) {
      event.node.res.statusCode = 400;
      return { message: 'Missing required fields' };
    }

    // Verify the report exists and belongs to the user's server
    const [existingReport] = await meosPool.query(
      'SELECT * FROM reports WHERE id = ? AND belongsToServer = ?',
      [id, user.belongsToServer]
    );

    if (!(existingReport as any)[0]) {
      event.node.res.statusCode = 404;
      return { message: 'Report not found' };
    }

    // Update the report status
    await meosPool.query(
      'UPDATE reports SET status = ? WHERE id = ? AND belongsToServer = ?',
      [status, id, user.belongsToServer]
    );

    return {
      message: 'Report status updated successfully',
      id,
      status
    };
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
}); 