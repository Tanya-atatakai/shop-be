import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
} from "aws-lambda";

export const main = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  const authorizationToken = event.authorizationToken;

  if (!authorizationToken) {
    console.log(`Error: authorizationToken is empty`);
    return generatePolicy("user", "Deny", event.methodArn);
  }

  const { username, password } = encodeCredentials(authorizationToken);

  console.log(`Credentials: username=${username}, password=${password}`);

  if (username && password && process.env[username] === password) {
    return generatePolicy("user", "Allow", event.methodArn);
  }

  return generatePolicy("user", "Deny", event.methodArn);
};

const generatePolicy = (
  principalId: string,
  effect: string,
  resource: string
): APIGatewayAuthorizerResult => {
  const authResponse: APIGatewayAuthorizerResult = {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };

  return authResponse;
};

const encodeCredentials = (
  token: string
): { username: string; password: string } => {
  try {
    const encodedCredentials = token.split(" ")[1];
    const buff = Buffer.from(encodedCredentials, "base64");
    const plainCredentials = buff.toString("utf-8").split("=");
    const username = plainCredentials[0];
    const password = plainCredentials[1];

    return { username, password };
  } catch {
    return { username: "", password: "" };
  }
};
