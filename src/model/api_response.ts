import { APIGatewayProxyResult } from 'aws-lambda';

export const APIResponse = (statusCode: number, result: unknown): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify(result),
});
