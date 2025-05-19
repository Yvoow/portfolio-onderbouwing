export default defineEventHandler(async (event) => {
  const headers = getRequestHeader(event, 'authorization')?.split(" ")[1];
  if (!headers || headers !== "88202e435cfeaabf0c50f095ad9da2da6749e29f7da80f40810de82ae40f56e6" ) {
    return { message: 'Unauthorized' };
  }
  return `Authentication header for jobs succesfully received`;
});
