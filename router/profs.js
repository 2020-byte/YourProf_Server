import express from 'express';
import { body } from 'express-validator';
import * as profController from '../controller/profs.js';
import { isAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';



const router = express.Router();

const validateRating = [
    body('review')
        .trim()
        .isLength({ min: 3 })
        .withMessage('text should be at least 3 characters'),
    validate,
];

//GET /profs
//GET /profs?search?=:search
router.get('/', profController.getProfs);

//GET /profs/:profId
router.get('/:profId', profController.getProf);



//POST /profs/:profId/ratings
router.post('/:profId/ratings', validateRating, profController.createRating);


//PUT /profs/:profId/ratings/:ratingId
router.put('/profs/:profId/ratings/:ratingId', validateRating, profController.updateRating);



//DELETE /profs/:profId/ratings/:ratingId
router.delete('/profs/:profId/ratings/:ratingId', profController.deleteRating);








export default router;