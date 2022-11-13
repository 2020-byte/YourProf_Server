import express from 'express';
import * as accountController from '../controller/account.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

//GET /profile
router.get('/profile', isAuth, accountController.getMyInfo);


//GET /profile/reviews/
router.get('/profile/reviews/', isAuth, accountController.getMyRatings);
//GET /profile/reviews/:departmentId
router.get('/profile/reviews/:departmentId', isAuth, accountController.getMyRatings);



//GET /profile/likes/
router.get('/profile/likes/', isAuth, accountController.getLikedRatings);
//GET /profile/likes/:departmentId
router.get('/profile/likes/:departmentId', isAuth, accountController.getLikedRatings);

//GET /profile/dislikes/
router.get('/profile/dislikes', isAuth, accountController.getDisLikedRatings);

//GET /profile/dislikes/:departmentId
router.get('/profile/dislikes/:departmentId', isAuth, accountController.getDisLikedRatings);


// //GET /bookmark
// router.get('/bookmark', accountController.getBookmark);





export default router;