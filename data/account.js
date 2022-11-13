import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
const DataTypes = SQ.DataTypes;
import { User } from './auth.js';
import { Prof, Grade, Rating, Course, Department, ORDER_DESC} from './profs.js';
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
    attributes: [
        'id',
        'quality',
        'difficulty',
        'WTCA',
        'TFC',
        'textbook',
        'attendance',
        'review',
        'createdAt',
        'updatedAt',
        'likes',
        'dislikes',
        'courseId',
        'profId',
        'gradeId',
        'userId',
        [Sequelize.col('course.name'), 'coursename'],
        [Sequelize.col('grade.name'), 'gradename'],
        [Sequelize.col('prof.name'), 'profname'],
        [Sequelize.col('course.departmentId'), 'departmentId'],
    ],
    include: [
        {
            model: Prof,
            attributes: [],
        },
        {
            model: Course,
            include: [{
                model: Department,
            }],
        },
        {
            model: Grade,
            attributes: [],
        },
    ]
}

export async function getMyInfo(userId) {
    return User.findOne({ ...userInfoWithoutPassword, where: { id: userId } });
}

export async function getMyRatings(userId) {
    const ratings = await Rating.findAll({
        ...RATING_INFO,
        ORDER_DESC,
        where: { userId }
    });

    return ratings;
}

export async function getMyRatingswithDepId(userId, departmentId) {
    const ratings = await Rating.findAll({
        ...RATING_INFO,
        ORDER_DESC,
        where: { userId, '$Course.departmentId$': parseInt(departmentId) }
    });

    return ratings;
}