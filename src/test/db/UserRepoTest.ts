import { getItem, putUser, updateUserAge, deleteUser} from '../../db/dynamo/userRepo';
import { UserEntity } from '../../model/dynamo/userEntity';

const getUserTest = async (userId: string) => {
    try {
        const user = await getItem(userId);
        console.log('User found:', user);
    } catch (err) {
        console.error('Error:', err);
    }
};

// 測試流程PUT
const putUserTest = async () => {
    try {
        const user: UserEntity = {
            UserId: 'user002',
            Name: 'Jane Smith',
            Age: 28,
            Email: 'jane.smith@example.com',
            Address: {
                Street: '456 Elm St',
                City: 'Somewhere',
                Zip: '67890',
            },
            Hobbies: ['Reading', 'Traveling'],
        };
        await putUser(user);
        console.log('User inserted:', user);
    } catch (err) {
        console.error('Error:', err);
    }
};

const updateUserAgeTest = async () => {
    try {
        const userId = 'user001';
        const newAge = 50;
        await updateUserAge(userId, newAge);
        console.log(`User ${userId} age updated to ${newAge}`);
    } catch (err) {
        console.error('Error:', err);
    }
}

const deleteUserTest = async () => {
    try {
        const userId = 'user001';
        await deleteUser(userId);
        console.log(`User ${userId} deleted`);
    } catch (err) {
        console.error('Error:', err);
    }
};

// 測試流程GET
(async () => {
    await getUserTest('user001');
    
    // await putUserTest();

    // await updateUserAgeTest();

    await deleteUserTest();

})();
