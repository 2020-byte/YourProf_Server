import * as accountRepository from '../data/account.js';


export async function getMyInfo(req, res) {
    const userId = req.userId;
    const data = await accountRepository.getMyInfo(userId);
    res.status(200).json(data);
}

export async function getMyRatings(req, res) {
    const userId = req.userId;
    const departmentId = req.params.departmentId;
    console.log(departmentId);
    console.log((departmentId != "undefined")&&(departmentId != "0"));
    //TODO:undefined을 string으로 받고 있음, search랑 다르게
    const data = await ((departmentId != "undefined")&&(departmentId != "0")
        ?accountRepository.getMyRatingswithDepId(userId, departmentId)
        : accountRepository.getMyRatings(userId));
    res.status(200).json(data);
}

