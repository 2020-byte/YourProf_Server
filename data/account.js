import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
const DataTypes = SQ.DataTypes;
import { User } from './auth.js';


const userInfoWithoutPassword = {
    attributes: [
        'id',
        'username',
        'name',
        'email',
    ],
}

export async function getMyInfo(userId) {
    return User.findOne({ ...userInfoWithoutPassword, where: { id: userId } });
}