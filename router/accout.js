import express from 'express';
import * as accountController from '../controller/account.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

//GET /profile
router.get('/profile', isAuth, accountController.getMyInfo);


// //GET /profile/reviews/:departmentId
router.get('/profile/reviews/:departmentId', isAuth, accountController.getMyRatings);

// //GET /profile/upvoterating
// router.get('/profile/upvoterating', accountController.getUpVoteRating);

// //GET /profile/downvoterating
// router.get('/profile/downvoterating', accountController.getDownVoteRating);

// //GET /bookmark
// router.get('/bookmark', accountController.getBookmark);





export default router;