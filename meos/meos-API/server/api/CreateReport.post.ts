import { meosPool } from "~/utils/db";
import { authenticate } from "~/utils/auth";

export default defineEventHandler(async(event) => {

  try {
    const user = await authenticate(event);
    if (!user) {
      event.node.res.statusCode = 401;
      return { message: 'Unauthorized' };
    }

    const body = await readBody(event);
    const { suspect, type, title, text, evidence, location, datetime, status, officer, laws, totals } = body;
    if (!suspect || !type || !title || !text || !datetime || !status || !officer || !totals) {
      event.node.res.statusCode = 400;
      return { message: 'Missing required fields' };
    }

    // Check if trying to create an arrest warrant
    if (type === 'Arrestatiebevel' && status === 'open') {
      // Check if an open arrest warrant already exists for this suspect
      const [existingWarrants] = await meosPool.query(
        'SELECT id FROM reports WHERE type = ? AND status = ? AND suspect = ? AND belongsToServer = ?',
        ['Arrestatiebevel', 'open', suspect, user.belongsToServer]
      );

      if ((existingWarrants as any[]).length > 0) {
        event.node.res.statusCode = 409; // Conflict
        return { 
          message: 'An open arrest warrant already exists for this suspect. Please close the existing warrant before creating a new one.'
        };
      }
    }

    const newReport = {
      belongsToServer: user.belongsToServer,
      suspect: suspect,
      type: type,
      title: title,
      text: text,
      evidence: evidence,
      location: JSON.stringify(location),
      datetime: datetime,
      status: status,
      officer: officer,
      laws: laws.length > 0 ? JSON.stringify(laws) : '[]',
      created_by: user.id,
      totals: JSON.stringify(totals) || '{}'
    }

    await meosPool.query('INSERT INTO reports SET ?', [newReport]);

    return newReport;
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});