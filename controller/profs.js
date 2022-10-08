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
    // if (rating.userId !== req.userId) 
    if (!rating.userId) {
        return res.sendStatus(403);
    }
    const updated = await profRepository.update(ratingId, ratingInfo);
    res.status(200).json(updated);
}

export async function deleteRating(req, res) {
    const ratingId = req.params.ratingId;
    const rating = await profRepository.getRatingById(ratingId);
    console.log(rating);
    if (!rating) {
        return res.status(404).json({ message: `Rating not found: ${ratingId}` });
    }
    //TODO: 나중에 Auth 처리해주기
    // if (rating.userId !== req.userId) 
    if (!rating.userId) {
        return res.sendStatus(403);
    }
    await profRepository.remove(ratingId);
    res.sendStatus(204);
}
