import { meosPool } from "~/utils/db";
import { authenticate, generateToken } from "~/utils/auth";

export default defineEventHandler(async (event) => {
  const user = await authenticate(event);
  if (!user) {
    event.node.res.statusCode = 401;
    return { message: 'Unauthorized' };
  }

  const [lawCats] = await meosPool.query('SELECT * FROM law_categories WHERE belongsToServer = ?', [user.belongsToServer]);
  return lawCats;
});
