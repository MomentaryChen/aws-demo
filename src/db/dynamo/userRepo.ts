import {
    DynamoDBClient,
    CreateTableCommand,
    PutItemCommand,
    GetItemCommand,
    UpdateItemCommand,
    DeleteItemCommand,
} from '@aws-sdk/client-dynamodb';
import { client } from '../dynamo-base';
import { UserEntity, marshallUser } from '../../model/dynamo/userEntity';

// 取得資料範例
export const getItem = async (userId: string): Promise<UserEntity | null> => {
    const command = new GetItemCommand({
        TableName: 'Users',
        Key: {
            UserId: { S: userId },
        },
    });
    const response = await client.send(command);

    const item = response.Item;
    if (item) {
        const user: UserEntity = {
            UserId: item.UserId.S!,
            Name: item.Name.S!,
            Age: Number(item.Age.N),
        };

        if (item.Email?.S) user.Email = item.Email.S;
        if (item.Address?.M) {
            user.Address = {
                Street: item.Address.M.Street.S!,
                City: item.Address.M.City.S!,
                Zip: item.Address.M.Zip.S!,
            };
        }
        if (item.Hobbies?.L) {
            user.Hobbies = item.Hobbies.L.map(v => v.S!);
        }

        return user;
    } else {
        console.log('Item not found');
    }

    return null;
};

// 插入資料
export const putUser = async (user: UserEntity) => {
    const command = new PutItemCommand({
        TableName: "Users",
        Item: marshallUser(user),
        ConditionExpression: "attribute_not_exists(UserId)"
    });
    await client.send(command);
    console.log("User inserted:", user.UserId);
};

// 更新資料
export const updateUserAge = async (userId: string, newAge: number) => {
    const command = new UpdateItemCommand({
        TableName: "Users",
        Key: { UserId: { S: userId } },
        UpdateExpression: "SET Age = :age",
        ExpressionAttributeValues: { ":age": { N: newAge.toString() } }
    });
    await client.send(command);
    console.log("User age updated:", userId);
};

// 刪除資料
export const deleteUser = async (userId: string) => {
    const command = new DeleteItemCommand({
        TableName: "Users",
        Key: { UserId: { S: userId } }
    });
    await client.send(command);
    console.log("User deleted:", userId);
};