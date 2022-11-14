import SQ from 'sequelize';
import { Op } from "sequelize";
import { sequelize } from '../db/database.js';
const DataTypes = SQ.DataTypes;
import { User } from './auth.js';
import { Prof, Grade, Rating, Course, Department, ORDER_DESC, PROF_INCLUDE_DEPARTMENT, ORDER_NAME_ASC} from './profs.js';
const Sequelize = SQ.Sequelize;

const IsLike = sequelize.define('isLike', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
    },
    { timestamps: false }
)

IsLike.belongsTo(Rating);
IsLike.belongsTo(User);

const IsDisLike = sequelize.define('isDisLike', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
},
{ timestamps: false }
)

IsDisLike.belongsTo(Rating);
IsDisLike.belongsTo(User);

const Bookmark = sequelize.define('bookmark', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
},
{ timestamps: false }
)

Bookmark.belongsTo(Prof);
Bookmark.belongsTo(User);


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
        ...ORDER_DESC,
        where: { userId }
    });

    return ratings;
}

export async function getMyRatingswithDepId(userId, departmentId) {
    const ratings = await Rating.findAll({
        ...RATING_INFO,
        ...ORDER_DESC,
        where: { userId, '$Course.departmentId$': parseInt(departmentId) }
    });

    return ratings;
}

export async function getLikedRatings(userId) {
    const data = await IsLike.findAll({
        attributes: ['ratingId'],//안되면 오타 부터 의심해보기(attribute => attributes)
        ORDER_DESC,
        where: { userId }
    });

    const ratingIds = data.map((i) => i.ratingId);

    const ratings = await Rating.findAll({
        ...RATING_INFO,
        ...ORDER_DESC,
        where: { id: {[Op.in]: ratingIds} }
    });

    return ratings;
}

export async function getLikedRatingswithDepId(userId, departmentId) {
    const data = await IsLike.findAll({
        attributes: ['ratingId'],
        ORDER_DESC,
        where: { userId }
    });

    const ratingIds = data.map((i) => i.ratingId);

    const ratings = await Rating.findAll({
        ...RATING_INFO,
        ...ORDER_DESC,
        where: { id: {[Op.in]: ratingIds}, '$Course.departmentId$': parseInt(departmentId) }
    });

    return ratings;
}

export async function getLikedRatingByUserIdandRatingId(userId, ratingId) {
    return IsLike.findOne({
        where: {ratingId, userId},
    })
}


export async function createLike(userId, ratingId) {
    return IsLike.create({
        ratingId,
        userId
    }
    ).then((data) => this.getLikeById(data.dataValues.id));
}

export async function getLikeById(id) {
    return IsLike.findOne({
        where: {id},
    })
}

export async function removeLike(id) {
    return IsLike.findByPk(id) //
    .then((like) => {
        like.destroy();
    });
}

export async function getDisLikedRatings(userId) {
    const data = await IsDisLike.findAll({
        attributes: ['ratingId'],
        ORDER_DESC,
        where: { userId }
    });

    const ratingIds = data.map((i) => i.ratingId);

    const ratings = await Rating.findAll({
        ...RATING_INFO,
        ...ORDER_DESC,
        where: { id: {[Op.in]: ratingIds} }
    });

    return ratings;
}

export async function getDisLikedRatingswithDepId(userId, departmentId) {
    const data = await IsDisLike.findAll({
        attributes: ['ratingId'],
        ORDER_DESC,
        where: { userId }
    });

    const ratingIds = data.map((i) => i.ratingId);

    const ratings = await Rating.findAll({
        ...RATING_INFO,
        ...ORDER_DESC,
        where: { id: {[Op.in]: ratingIds}, '$Course.departmentId$': parseInt(departmentId) }
    });

    return ratings;
}

export async function getDisLikedRatingByUserIdandRatingId(userId, ratingId) {
    return IsDisLike.findOne({
        where: {ratingId, userId},
    })
}

export async function createDisLike(userId, ratingId) {
    return IsDisLike.create({
        ratingId,
        userId
    }
    ).then((data) => this.getDisLikeById(data.dataValues.id));
}

export async function getDisLikeById(id) {
    return IsDisLike.findOne({
        where: {id},
    })
}

export async function removeDisLike(id) {
    return IsDisLike.findByPk(id) //
    .then((like) => {
        like.destroy();
    });
}




export async function getBookmarks(userId) {
    const data = await Bookmark.findAll({
        attributes: ['profId'],
        ORDER_DESC,
        where: { userId }
    });

    const profIds = data.map((i) => i.profId);

    const profs = await Prof.findAll({
        ...PROF_INCLUDE_DEPARTMENT,
        ...ORDER_NAME_ASC,
        where: { id: {[Op.in]: profIds} }
    });

    return profs;
}

export async function getBookmarkswithDepId(userId, departmentId) {
    const data = await Bookmark.findAll({
        attributes: ['profId'],
        ORDER_DESC,
        where: { userId }
    });

    const profIds = data.map((i) => i.profId);

    const profs = await Prof.findAll({
        ...PROF_INCLUDE_DEPARTMENT,
        ...ORDER_NAME_ASC,
        where: { id: {[Op.in]: profIds}, departmentId: parseInt(departmentId) }
    });

    return profs;
}

export async function getBookmarkById(id) {
    return Bookmark.findOne({
        where: {id},
    })
}

export async function getBookmarkByUserIdandProfId(userId, profId) {
    return Bookmark.findOne({
        where: {profId, userId},
    })
}


export async function createBookmark(userId, profId) {
    return Bookmark.create({
        profId,
        userId
    }
    ).then((data) => this.getBookmarkById(data.dataValues.id));
}

export async function removeBookmark(id) {
    return Bookmark.findByPk(id) //
    .then((bookmark) => {
        bookmark.destroy();
    });
}