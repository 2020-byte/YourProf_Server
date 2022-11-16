import * as profRepository from '../data/profs.js';

export async function getDepartments(req, res) {
    const data = await profRepository.getAllDepartments();
    res.status(200).json(data);
}


export async function getProfs(req, res) {
    const search = req.query.search;
    const data = await (search
        ? profRepository.getAllBySearch(search)
        : profRepository.getAll());
    res.status(200).json(data);
}

export async function getProfswithDepId(req, res) {
    const search = req.query.search;
    const depId = req.params.depId;
    const data = await (search
        ? profRepository.getAllBySearchDepId(search, depId)
        : profRepository.getAllwithDepId(depId));
    res.status(200).json(data);
}

export async function getProf(req, res) {
    const profId = req.params.profId;
    const prof = await profRepository.getProfById(profId);

    const courses = await profRepository.getCoursesById(profId);

    const ratings = await profRepository.getRatingByProfId(profId);


    if (prof && courses && ratings)  {
        res.status(200).json( {prof, courses, ratings});
    } else {
        res.status(404).json({message: `Prof id(${profId}) not found`});
    }
}

export async function getRatings(req, res) {
    const profId = req.params.profId;
    const courseId = req.params.courseId;
    const ratings = await profRepository.getRatingsByProfIdwithCourseId(profId, courseId);

    if (ratings)  {
        res.status(200).json(ratings);
    } else {
        //profId, courseId 구분해서 에러 던져야 되는데 이거 나중에 고치기. 
        //지금 당장은 course를 선택하려면 profId를 가진  url로 들어와야 되서 상관없지만.
        res.status(404).json({message: `Prof id(${courseId}) not found`});
    }
}

export async function getRating(req, res) {
    const ratingId = req.params.ratingId;
    const rating = await profRepository.getRatingById(ratingId);
    if (rating) {
        res.status(200).json(rating);
    } else {
        res.status(404).json({message: `Rating id(${ratingId}) not found`});
    }
}


export async function createRating(req, res) {
    const ratingInfo = req.body;
    const rating = await profRepository.create(ratingInfo, req.userId);
    res.status(201).json(rating);
}

export async function updateRating(req, res) {
    const ratingId = req.params.ratingId;
    const ratingInfo = req.body;
    const rating = await profRepository.getRatingById(ratingId);
    //여기서 현재 rating의 id로 현재 rating정보를 받고, 현재 rating의 id는 url에서 받음.
    if (!rating) {
        return res.status(404).json({ message: `Rating not found: ${ratingId}` });
    }
    //TODO: 나중에 Auth 처리해주기
    // if (rating.userId !== req.userId) //Done
    if (rating.userId != req.userId) {
        return res.sendStatus(403);
    }
    const updated = await profRepository.update(ratingId, ratingInfo);
    res.status(200).json(updated);
}

export async function deleteRating(req, res) {
    const ratingId = req.params.ratingId;
    const rating = await profRepository.getRatingById(ratingId);
    if (!rating) {
        return res.status(404).json({ message: `Rating not found: ${ratingId}` });
    }
    //TODO: 나중에 Auth 처리해주기(해결됨)
    // if (rating.userId !== req.userId) //Done 
    if (rating.userId != req.userId) {
        return res.sendStatus(403);
    }
    await profRepository.remove(ratingId, rating.dataValues.profId);//sequelize에서 가져온거 dataValues붙여주는 거


    //TODO:DELETE res.json()를 못받아온다. 이거 알아보기!
    //(위에 rating.userId == req.userId 이렇게 해놨었음)
    res.status(204).json({ message: 'deleted' });
    //TODO:message: deleted가 안나옴(해결)
    //=> json 204는 원래 content를 안보낸데
    //res.status(204).send() 이렇게 하는 게 맞는 것 같데.
    //res.sendStatus(204);
}


export async function addView(req, res) {
    const profId = req.params.profId;
    const prof = await profRepository.getProfById(profId);
    if (!prof) {
        return res.status(404).json({ message: `Prof not found: ${profId}` });
    }
    const updated = await profRepository.updateProf(profId);
    res.status(200).json(updated);
}
