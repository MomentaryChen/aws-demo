import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { APIResponse } from './model/api_response';
import { getAllUsers } from './db/db';

export const hello = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Event:', event);

    await getAllUsers();

    return APIResponse(200, { message: 'Hello from TypeScript Lambda!' });
};