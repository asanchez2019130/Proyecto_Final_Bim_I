import { Router } from "express";
import { check } from "express-validator";
import {
  getUsers,
  createUser,
  getUserById,
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

// Ruta para obtener un usuario por su ID
router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioById),
    validarCampos,
  ],
  getUserById
);

// Ruta para crear un nuevo usuario
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe ser mayor a 6 caracteres").isLength({
      min: 6,
    }),
    check("correo", "Este no es un correo válido").isEmail(),
    check("correo").custom(existenteEmail),
    check("role").custom(esRoleValido),
    check("phone","El teléfono debe de contener 8 números").isLength({min: 8, max:8}),
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
    validarCampos,
  ],
  updateUser
);

// Ruta para eliminar un usuario por su ID
router.delete(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioById),
    validarCampos,
  ],
  deleteUser
);

export default router;