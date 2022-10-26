import * as accountRepository from '../data/account.js';


export async function getMyInfo(req, res) {
    const userId = req.userId;
    const data = await accountRepository.getMyInfo(userId);
    res.status(200).json(data);
}

