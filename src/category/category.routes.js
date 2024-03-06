import { Router } from "express";
import { check } from "express-validator";
import {
    createCategory,
    deleteCategory,
    getCategory,
    updateCategory
} from './category.controller.js'

import { existeCategory, existeCategoryById } from '../helpers/db-validators.js'
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.get("/", getCategory);

router.post(
    "/",
    [
        check("nameCategory", "El nombre es obligatorio").not().isEmpty(),
        validarCampos,
    ],
    createCategory
);

router.put(
    "/:id",
    [
        check('id', 'No es un Id valido').isMongoId(),
        check("id").custom(existeCategoryById),
        validarCampos,
    ],
    updateCategory
);

router.delete(
    "/:id",
    [
        // validarJWT,
        // tieneRole('ADMIN', 'CLIENT'),
        check('id', 'No es un Id valido').isMongoId(),
        check("id").custom(existeCategoryById),
        validarCampos,
    ],
    deleteCategory
);

export default router;