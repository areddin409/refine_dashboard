import express from "express"

import {
  createProperty,
  getAllProperties,
  getPropertyDetail,
  updateProperty,
  deleteProperty
} from "../controllers/property.controller.js"

const router = express.Router()

router.route("/").get(getAllProperties).post(createProperty)
router
  .route("/:id")
  .get(getPropertyDetail)
  .patch(updateProperty)
  .delete(deleteProperty)

export default router
