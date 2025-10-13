import { hello } from '../handler';

const event = {
    queryStringParameters: null,
    body: null,
    headers: {},
    pathParameters: null,
} as any; // 可以用 any 繞過型別檢查

hello(event).then(console.log);
