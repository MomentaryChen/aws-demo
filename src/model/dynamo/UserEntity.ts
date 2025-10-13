import { Interface } from "readline";


export interface Address {
    Street: string;
    City: string;
    Zip: string;
}

// 建立User Entity
export interface UserEntity {
    UserId: string;       // 主鍵
    Name: string;
    Age: number;
    Email?: string;       // 可選欄位
    Address?: Address;    // 可選
    Hobbies?: string[];   // List
}


/** 將 UserEntity 轉成 DynamoDB Item */
export const marshallUser = (user: UserEntity) => {
    const item: Record<string, any> = {
        UserId: { S: user.UserId },
        Name: { S: user.Name },
        Age: { N: user.Age.toString() }
    };
    if (user.Email) item.Email = { S: user.Email };
    if (user.Address) {
        item.Address = { M: { Street: { S: user.Address.Street }, City: { S: user.Address.City }, Zip: { S: user.Address.Zip } } };
    }
    if (user.Hobbies) {
        item.Hobbies = { L: user.Hobbies.map(h => ({ S: h })) };
    }
    return item;
};

/** 將 DynamoDB Item 轉回 UserEntity */
export const unmarshallUser = (item: Record<string, any>): UserEntity => {
    const user: UserEntity = {
        UserId: item.UserId.S,
        Name: item.Name.S,
        Age: Number(item.Age.N)
    };
    if (item.Email?.S) user.Email = item.Email.S;
    if (item.Address?.M) {
        user.Address = {
            Street: item.Address.M.Street.S,
            City: item.Address.M.City.S,
            Zip: item.Address.M.Zip.S
        };
    }
    if (item.Hobbies?.L) user.Hobbies = item.Hobbies.L.map((v: any) => v.S);
    return user;
};