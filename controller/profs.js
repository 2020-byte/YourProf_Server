import * as profRepository from '../data/profs.js';


export async function getProfs(req, res) {
    const search = req.query.search;
    const data = await (search
        ? profRepository.getAllBySearch(search)
        : profRepository.getAll());
    res.status(200).json(data);
}

export async function getProf(req, res) {
    const profId = req.params.profId;
    const prof = await profRepository.getProfById(profId);

    const courses = await profRepository.getCoursesById(profId);

    const ratings = await profRepository.getRatingById(profId);


    if (prof && courses && ratings)  {
        res.status(200).json( {prof, courses, ratings});
    } else {
        res.status(404).json({message: `Prof id(${profId}) not found`});
    }
}



export async function createRating(req, res) {
    const ratingInfo = req.body;
    const rating = await tweetRepository.create(ratingInfo, req.userId);
    res.status(201).json(rating);
}

export async function updateRating(req, res) {
    const ratingId = req.params.ratingId;
    const ratingInfo = req.body;
    const rating = await profRepository.getRatingById(ratingId);
    if (!rating) {
        return res.status(404).json({ message: `Rating not found: ${ratingId}` });
    }
    if (rating.userId !== req.userId) {
        return res.sendStatus(403);
    }
    const updated = await profRepository.update(ratingId, ratingInfo);
    res.status(200).json(updated);
}

export async function deleteRating(req, res) {
    const ratingId = req.params.ratingId;
    const rating = await profRepository.getById(ratingId);
    if (!rating) {
        return res.status(404).json({ message: `Rating not found: ${ratingId}` });
    }
    if (rating.userId !== req.userId) {
        return res.sendStatus(403);
    }
    await profRepository.remove(ratingId);
    res.sendStatus(204);
}
