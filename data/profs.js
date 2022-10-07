import SQ from 'sequelize';
import { Op } from "sequelize";
//이거 괄호 붙이고 안붙히고 차이가 뭐지.
//Op는 default가 아니라서 {}없이 Op불러오면
//없는 default값을 불러오는 거임
//SQ는 default값이고 SQ를 {}붙여서 불러오면
//존재하지 않는 specific한 SQ를 불러오는 거임.
import { sequelize } from '../db/database.js';
import { User } from './auth.js';
const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

// 1) Prof Items
const Prof = sequelize.define('prof', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        ratings: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        quality: {
            type: DataTypes.DOUBLE(2,1),
            allowNull: false,
            defaultValue: -1,
        },
        departmentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        WTA: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: -1,
        },
        LOD: {
            type: DataTypes.DOUBLE(2,1),
            allowNull: false,
            defaultValue: -1,
        },
        university: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
    },
    { timestamps: false }
);

// 2) Department Items
const Department = sequelize.define('department', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
    },
    { timestamps: false }
);

// 3) Course Items
const Course =  sequelize.define('course', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
    }, { timestamps: false }
)

// 4) Rating Items
const Rating = sequelize.define('rating', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    quality: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    difficulty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: -1,
    },
    WTCA: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    TFC: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    textbook: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    attendance: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    review: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    dislikes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }
})

// 5) Grade Items
const Grade = sequelize.define('grade', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        value: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, { timestamps: false }
)

Prof.belongsTo(Department);
Course.belongsTo(Prof);
Course.belongsTo(Department);
Rating.belongsTo(Prof);
Rating.belongsTo(Course);
Rating.belongsTo(User);
Rating.belongsTo(Grade);



const PROF_INCLUDE_DEPARTMENT = {
    attributes: [
        'id',
        'name',
        'ratings',
        'quality',
        'WTA',
        'LOD',
        'university',
        'departmentId',
        //[Sequelize.col('dapartment.name'), 'departmentname'], 
        //typo: dapartment -> department 항상 똑같이 햇는 데 틀리면 오타부터 의심.
        //사용하려는 변수 복사 붙여넣기로 오타 없애기. 
        [Sequelize.col('department.name'), 'departmentname'],
    ],
    include: {
        model: Department,
        attributes: [],
    },
};


const COURSE_INCLUDE_PROF = {
    attributes: [
        'id',
        'name',
        'profId',
    ],
    include: {
        model: Prof,
        attributes: [],
    },
}



const RATING_INCLUDE_PROF_COURSE_GRADE_USER = {
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
    ],
    include: [
        {
            model: Prof,
            attributes: [],
        },
        {
            model: Course,
            attributes: [],
        },
        {
            model: Grade,
            attributes: [],
        },
    ]
}

const ORDER_DESC = {
    order: [['createdAt', 'DESC']],
};

const ORDER_ID_ASC = {
    order: [['id', 'ASC']],
};

const ORDER_NAME_ASC = {
    order: [['name', 'ASC']],
};

export async function getAll() {
    return Prof.findAll({ ...PROF_INCLUDE_DEPARTMENT, ...ORDER_NAME_ASC });
}

export async function getAllBySearch(search) {
    return Prof.findAll({
        ...PROF_INCLUDE_DEPARTMENT,
        ...ORDER_ID_ASC,
        // where: { 
        //     name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + search.toLowerCase() + '%')
        // },
        where: {
            name: { [Op.like]: `%${search}%` },//저절로 대소문자 구분없이 해주는데
        },
    });
}

export async function getProfById(id) {
    return Prof.findOne({
        ...PROF_INCLUDE_DEPARTMENT,
        where: { id },
    });
}



export async function getCoursesById(profId) {
    return  Course.findAll({
        ...COURSE_INCLUDE_PROF,
        ...ORDER_NAME_ASC,
        where: {profId},
    })
}



export async function getRatingByProfId(profId) {
    return Rating.findAll({
        ...RATING_INCLUDE_PROF_COURSE_GRADE_USER,
        ORDER_DESC,
        where: {profId},
    })
}


//TODO: userId 바꿔야 함!
export async function create(ratingInfo, userId) {
    const {
        quality,
        difficulty,
        WTCA,
        TFC,
        textbook,
        attendance,
        review,
        likes,
        dislikes,
        profId,
        courseId,
        gradeId,
    } = ratingInfo;
    return Rating.create({
        quality,
        difficulty,
        WTCA,
        TFC,
        textbook,
        attendance,
        review,
        likes,
        dislikes,
        profId,
        courseId,
        gradeId,
        userId: 1 
    }
    ).then((data) => this.getRatingById(data.dataValues.id));
}

export async function getRatingById(id) {
    return Rating.findOne({
        ...RATING_INCLUDE_PROF_COURSE_GRADE_USER,
        where: {id},
    })
}



export async function update(ratingId, ratingInfo) {
    return Rating.findByPk(ratingId) //
        .then((rating) => {
            rating.quality = ratingInfo.quality;
            rating.difficulty = ratingInfo.difficulty;
            rating.WTCA = ratingInfo.WTCA;
            rating.TFC = ratingInfo.TFC;
            rating.textbook = ratingInfo.textbook;
            rating.attendance = ratingInfo.attendance;
            rating.review = ratingInfo.review;
            rating.gradeId = ratingInfo.gradeId;
            return rating.save();
        }
    );
}

export async function remove(id) {
  return Rating.findByPk(id) //
    .then((rating) => {
        rating.destroy();
    });
}

