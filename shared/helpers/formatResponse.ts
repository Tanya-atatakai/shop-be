const SUCCESS_STATUS = 200;
const NOT_FOUND_STATUS = 404;
const BAD_REQUEST_STATUS = 400;
const SERVER_ERROR_STATUS = 500;

const CORS_HEADERS: Record<string, string | number | boolean> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: SUCCESS_STATUS,
    headers: CORS_HEADERS,
    body: JSON.stringify(response),
  };
};

export const formatNotFoundResponse = (message: string) => {
  return {
    statusCode: NOT_FOUND_STATUS,
    headers: CORS_HEADERS,
    body: JSON.stringify({ message }),
  };
};

export const formatBadRequestResponse = (error: string) => {
  return {
    statusCode: BAD_REQUEST_STATUS,
    headers: CORS_HEADERS,
    body: JSON.stringify({ error }),
  };
};

export const formatServerErrorResponse = () => {
  return {
    statusCode: SERVER_ERROR_STATUS,
    headers: CORS_HEADERS,
    body: JSON.stringify({ error: "Internal server error" }),
  };
};
