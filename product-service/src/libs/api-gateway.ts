import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';

export type APIGatewayProxyEventHandler = Handler<APIGatewayProxyEvent, APIGatewayProxyResult>;
