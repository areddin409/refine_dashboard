import Property from "../mongodb/models/property.js"
import User from "../mongodb/models/user.js"

import mongoose from "mongoose"
import * as dotenv from "dotenv"
import { v2 as cloudinary } from "cloudinary"

// Configure dotenv to read .env file
dotenv.config()

// Configure cloudinary to upload images to the cloud
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Get all properties from the database and return them in a paginated format
const getAllProperties = async (req, res) => {
  const {
    _end,
    _order,
    _start,
    _sort,
    title_like = "",
    propertyType = ""
  } = req.query

  const query = {}

  if (propertyType !== "") {
    query.propertyType = propertyType
  }

  if (title_like) {
    query.title = { $regex: title_like, $options: "i" }
  }

  try {
    const count = await Property.countDocuments({ query })

    const properties = await Property.find(query)
      .limit(_end)
      .skip(_start)
      .sort({ [_sort]: _order })

    res.header("x-total-count", count)
    res.header("Access-Control-Expose-Headers", "x-total-count")

    res.status(200).json(properties)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get a single property from the database and return it
const getPropertyDetail = async (req, res) => {
  const { id } = req.params
  const propertyExists = await Property.findById({ _id: id }).populate(
    "creator"
  )
  if (propertyExists) res.status(200).json(propertyExists)
  else res.status(404).json({ message: "Property not found" })
}

// Create a new property in the database
const createProperty = async (req, res) => {
  console.log("create")
  try {
    const { title, description, propertyType, location, price, photo, email } =
      req.body

    // Create a session to ensure that the user and property are created in the same transaction
    const session = await mongoose.startSession()
    session.startTransaction()

    const user = await User.findOne({ email }).session(session)

    if (!user) throw new Error("User not found")

    const photoUrl = await cloudinary.uploader.upload(photo)

    const newProperty = await Property.create({
      title,
      description,
      propertyType,
      location,
      price,
      photo: photoUrl.url,
      creator: user._id
    })

    user.allProperties.push(newProperty._id)
    await user.save({ session })

    await session.commitTransaction()

    res.status(200).json({ message: "Property created successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update a property in the database
const updateProperty = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, propertyType, location, price, photo } =
      req.body

    const photoUrl = await cloudinary.uploader.upload(photo)

    // update the property in the database with the new data
    await Property.findByIdAndUpdate(
      { _id: id },
      {
        title,
        description,
        propertyType,
        location,
        price,
        photo: photoUrl.url || photo
      }
    )

    res.status(200).json({ message: "Property updated successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete a property from the database
const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params

    const propertyToDelete = await Property.findById({ _id: id }).populate(
      "creator"
    )

    if (!propertyToDelete) throw new Error("Property not found")

    // start a session to ensure that all the operations are executed in a transaction
    const session = await mongoose.startSession()
    session.startTransaction()

    // remove the property from the user's allProperties array
    propertyToDelete.remove({ session })
    propertyToDelete.creator.allProperties.pull(propertyToDelete)

    // save the user and commit the transaction
    await propertyToDelete.creator.save({ session })
    await session.commitTransaction()

    // send a response to the client
    res.status(200).json({ message: "Property deleted successfully" })
  } catch (error) {
    // if an error occurs, abort the transaction and send the error message to the client
    res.status(500).json({ message: error.message })
  }
}

export {
  getAllProperties,
  getPropertyDetail,
  createProperty,
  updateProperty,
  deleteProperty
}
