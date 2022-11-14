import * as accountRepository from '../data/account.js';


export async function getMyInfo(req, res) {
    const userId = req.userId;
    const data = await accountRepository.getMyInfo(userId);
    res.status(200).json(data);
}

export async function getMyRatings(req, res) {
    const userId = req.userId;
    const departmentId = req.params.departmentId;
    //TODO:undefined을 string으로 받고 있음, search랑 다르게
    //해결: 프론트쪽에서 받을 때 undefined이면 ''로 보내야함. 
    //string안에 undeifned 넣어서 보내면 undefined도 스트링으로 받아와짐.
    const data = await ((departmentId != undefined)&&(departmentId != "0")
        ?accountRepository.getMyRatingswithDepId(userId, departmentId)
        : accountRepository.getMyRatings(userId));
    res.status(200).json(data);
}

export async function getLikedRatings(req, res) {
    const userId = req.userId;
    const departmentId = req.params.departmentId;
    
    const data = await ((departmentId != undefined)
        ?accountRepository.getLikedRatingswithDepId(userId, departmentId)
        : accountRepository.getLikedRatings(userId));
    res.status(200).json(data);
}

export async function getLikedRating(req, res) {
    const userId = req.userId;
    const ratingId = req.params.ratingId;
    const rating = await accountRepository.getLikedRatingByUserIdandRatingId(userId, ratingId);
    res.status(200).json(rating);

}

export async function getDisLikedRatings(req, res) {
    const userId = req.userId;
    const departmentId = req.params.departmentId;
    
    const data = await ((departmentId != undefined)
        ?accountRepository.getDisLikedRatingswithDepId(userId, departmentId)
        : accountRepository.getDisLikedRatings(userId));
    res.status(200).json(data);
}

export async function getDisLikedRating(req, res) {
    const userId = req.userId;
    const ratingId = req.params.ratingId;
    const rating = await accountRepository.getDisLikedRatingByUserIdandRatingId(userId, ratingId);
    res.status(200).json(rating);

}

export async function getBookmarks(req, res) {
    const userId = req.userId;
    const departmentId = req.params.departmentId;
    
    const data = await ((departmentId != undefined)
        ?accountRepository.getBookmarkswithDepId(userId, departmentId)
        : accountRepository.getBookmarks(userId));
    res.status(200).json(data);
}

export async function getBookmark(req, res) {
    const userId = req.userId;
    const profId = req.params.profId;
    const bookmark = await accountRepository.getBookmarkByUserIdandProfId(userId, profId);
    res.status(200).json(bookmark);

}

export async function createBookmark(req, res) {
    const userId = req.userId;
    const profId = req.params.profId;
    const bookmark = await accountRepository.create(userId, profId);
    res.status(201).json(bookmark);

}

export async function deleteBookmark(req, res) {
    const userId = req.userId;
    const profId = req.params.profId;
    const bookmark = await accountRepository.getBookmarkByUserIdandProfId(userId, profId);
    if (!bookmark) {
        return res.status(404).json({message: `Bookmark not found: ${profId}(profId)`});
    }
    
    if (bookmark.userId != userId) {
        return res.sendStatus(403);
    }
    await accountRepository.remove(bookmark.id);

    res.status(204).send();
    //TODO:message: deleted가 안나옴(해결)
    //=> json 204는 원래 content를 안보낸데
    //res.status(204).send() 이렇게 하는 게 맞는 것 같데.

}