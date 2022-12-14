import express from 'express';
import { body } from 'express-validator';
import * as profController from '../controller/profs.js';
import { isAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';



const router = express.Router();

// const validateRating = [
//     body('review')
//         .trim()
//         .isLength({ min: 3 })
//         .withMessage('Reivew should be at least 3 characters'),
//     validate,
// ];

//GET /profs/departments
router.get('/departments', profController.getDepartments);

//GET /profs
//GET /profs?search?=:search
router.get('/', profController.getProfs);

//GET /profs/departments/:depId
//GET /profs/departments/:depId/?search=:search
router.get('/departments/:depId', profController.getProfswithDepId);

//GET /profs/:profId
router.get('/:profId', profController.getProf);

//POST /profs/:profId
router.post('/:profId', profController.addView);


//GET /profs/:profId/courses/:courseId
router.get('/:profId/courses/:courseId', profController.getRatings);

//GET /profs/:profId/ratings/:ratingId
router.get('/:profId/ratings/:ratingId', profController.getRating);





//POST /profs/:profId/ratings
router.post('/:profId/ratings', isAuth, profController.createRating);


//PUT /profs/:profId/ratings/:ratingId
router.put('/:profId/ratings/:ratingId', isAuth, profController.updateRating);



//DELETE /profs/:profId/ratings/:ratingId
router.delete('/:profId/ratings/:ratingId', isAuth, profController.deleteRating);








export default router;