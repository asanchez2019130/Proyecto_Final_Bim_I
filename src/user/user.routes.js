import { Router } from "express";
import { check } from "express-validator";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "./user.controller.js";
import {
  existenteEmail,
  esRoleValido,
  existeUsuarioById,
} from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { tieneRole } from "../middlewares/validar-roles.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

// Ruta para obtener la lista de usuarios
router.get("/", getUsers);

// Ruta para crear un nuevo usuario
router.post(
  "/",
  [
    check("firstName", "El nombre es obligatorio").not().isEmpty(),
    check("lastName", "El nombre es obligatorio").not().isEmpty(),
    check("userName", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe ser mayor a 6 caracteres").isLength({
      min: 6,
    }),
    check("email", "Este no es un correo válido").isEmail(),
    check("email").custom(existenteEmail),
    check("role").custom(esRoleValido),
    validarCampos,
  ],
  createUser
);

// Ruta para actualizar un usuario por su ID
router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioById),
    validarJWT,
    validarCampos,
  ],
  updateUser
);

// Ruta para eliminar un usuario por su ID
router.delete(
  "/:id",
  [
    //validarJWT,
    tieneRole("ADMIN", "CLIENT"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioById),
    validarCampos,
  ],
  deleteUser
);

export default router;