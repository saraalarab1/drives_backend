import { Router } from "express";
import { getUsers, Register, Login, Logout, getCampuses, getUniversities } from "../controllers/users.js";
const router = Router();

router.get('/', getUsers);
router.get(`/:id/campuses`, getCampuses);
router.get('/universities', getUniversities);
router.post('/register', Register);
router.post('/login', Login);
router.delete('/logout', Logout);

export default router;
