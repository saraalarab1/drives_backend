import { Router } from "express";
import { getUsers, Register, Login, Logout } from "../controllers/users.js";

const router = Router();

router.get('/', getUsers);
router.post('/register', Register);
router.post('/login', Login);
router.delete('/logout', Logout);

export default router;
