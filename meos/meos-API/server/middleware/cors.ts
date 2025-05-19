export default defineEventHandler((event) => {
  setResponseHeaders(event, {
      "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Expose-Headers": "Authorization"
  });

  if (event.method === 'OPTIONS') {
      event.node.res.statusCode = 204;
      event.node.res.statusMessage = "No Content";
      return "OK";
  }
});
