import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
const DataTypes = SQ.DataTypes;
import { User } from './auth.js';
import { Rating, Course, Department, RATING_INCLUDE_PROF_COURSE_GRADE_USER, ORDER_DESC} from './profs.js';
const Sequelize = SQ.Sequelize;




const userInfoWithoutPassword = {
    attributes: [
        'id',
        'username',
        'name',
        'email',
    ],
}

const RATING_INFO = {
    ...RATING_INCLUDE_PROF_COURSE_GRADE_USER,
    include: [
        {
            model: Department,
            attributes: [
                "id",
                "name"
            ],
        }
    ]
}

export async function getMyInfo(userId) {
    return User.findOne({ ...userInfoWithoutPassword, where: { id: userId } });
}

export async function getMyRatings(userId) {
    const ratings = Rating.findAll({
        ...RATING_INCLUDE_PROF_COURSE_GRADE_USER,
        ORDER_DESC,
        where: { userId }
    })


}