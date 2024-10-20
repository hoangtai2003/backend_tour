import express from "express";
import { createPermission, createRole, editRole, getAllPermission, getAllRole, getRole } from "../controllers/RoleController.js";

const router = express.Router()

router.get('/', getAllRole)

router.post('/', createRole)

router.post('/create-permission', createPermission)

router.get('/all-permission', getAllPermission)

router.get('/:id', getRole)

router.put('/:id', editRole)
export default router