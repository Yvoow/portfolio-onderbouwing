import { authenticate } from "~/utils/auth";

export default defineEventHandler(async(event) => {

  try {
    const user = await authenticate(event);
    if (!user) {
      event.node.res.statusCode = 401;
      return { message: 'Unauthorized' };
    }

    return user;
  } catch (error) {
    event.node.res.statusCode = 500;
    return { message: error.message };
  }
});