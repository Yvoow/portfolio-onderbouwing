import { meosPool } from "~/utils/db";
import { authenticate, generateToken } from "~/utils/auth";

export default defineEventHandler(async (event) => {
  const { name, color } = await readBody(event);
  const user = await authenticate(event);
  if (!user || (!user.serverAdmin && !user.meosAdmin)) {
    event.node.res.statusCode = 401;
    return { message: 'Unauthorized' };
  }

  if (!name || !color) {
    event.node.res.statusCode = 400;
    return { message: 'Name and color are required' };
  }

  const [lawCatExists] = await meosPool.query('SELECT * FROM law_categories WHERE name = ? AND belongsToServer = ?', [name, user.belongsToServer]);
  if (lawCatExists[0]) {
    event.node.res.statusCode = 409;
    return { message: 'Law category already exists' };
  }

  try {
    const [lawCat] = await meosPool.query('INSERT INTO law_categories (name, color, belongsToServer, created_by) VALUES (?, ?, ?, ?)', [name, color, user.belongsToServer, user.id]);
    return { message: 'Law category created successfully', lawCat };
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: 'Failed to create law category' };
  }
});