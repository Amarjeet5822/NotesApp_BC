const express = require("express")
const {auth} = require("../middlewares/authMw")
const {NoteModel} = require("../models/note.models")
const { addPostMiddleware } = require("../middlewares/addPostMiddleware")
const { isNoteAuthenticated } = require("../middlewares/isNoteAuthenticated")
const noteRouter = express.Router()

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a new note
 *     description: Adds a new note for the authenticated user.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Meeting Notes"
 *               content:
 *                 type: string
 *                 example: "Discussed project roadmap and deadlines."
 *               category: 
 *                 type: string
 *                 enum: ["work", "personal", "ideas", "shopping list","others"]
 *                 default: others
 *               priority: 
 *                 type: string
 *                 enum: ["high", "medium", "low"]
 *                 default: medium
 *              
 *     responses:
 *       200:
 *         description: Note created successfully.
 *       500:
 *         description: Internal server error.
 */
noteRouter.post("/", auth, addPostMiddleware ,async (req,res)=>{
  //
  const {title, content} = req.body;
  const { userId, user } = req.user;
  try {
    const newNote = new NoteModel({ title, content, userId, user});
    await newNote.save();
    res.status(200).json({msg:"Note created Successfully!"});
  } catch(error) {
    console.log(error.message)
    res.status(500).json({msg:"Internal server error", error});
  }
})
/**
 * @swagger
 * /notes:
 *   get:
 *     summary: get all notes
 *     description: Fetches all notes belonging to the authenticated user.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *   responses:
 *     200:
 *       description: List of Notes retrieved successfully.
 *     500:
 *       description: Internal server error. 
 */

noteRouter.get("/",auth, async (req,res)=>{
    try {
      const {userId } = req.user
      const notes = await NoteModel.find({ userId});
      res.status(200).json({notes})
    } catch(error) {
        res.status(500).json({msg:"Internal server error", error});
    }
})

/**
 * @swagger
 * /notes/{noteId}:
 *   get:
 *     summary: Get a single note by ID
 *     description: Retrieves a specific note using its ID.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the note
 *     responses:
 *       200:
 *         description: Note retrieved successfully.
 *       500:
 *         description: Failed to retrieve note.
 */
noteRouter.get("/:noteId", auth, isNoteAuthenticated, async (req, res) => {
  try {
    console.log("route notes to get single note")
    const { noteId} = req.params;
    const userNote = await NoteModel.findById( noteId);
    res.status(200).json(userNote);
  } catch (error) {
    res.status(500).json({msg: "failed Try again!"})
  }
})

/**
 * @swagger
 * /notes/{noteId}:
 *   patch:
 *     summary: Update a note
 *     description: Updates the content of a specific note.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the note to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Note Title"
 *               content:
 *                 type: string
 *                 example: "Updated note content."
 *     responses:
 *       201:
 *         description: Note updated successfully.
 *       500:
 *         description: Internal server error.
 */
noteRouter.patch("/:noteId",auth, isNoteAuthenticated, async (req,res)=>{
  try {
    // http://localhost:8080/notes/36234222525asdfdsklnsd521
    const { noteId } = req.params;
    const updatedNote = await NoteModel.findByIdAndUpdate( noteId, req.body, {new: true});
    res.status(201).json({ message:"Note updated successfully!", updatedNote });

  } catch (error) {
    res.status(500).json({error})
  }
})

/**
 * @swagger
 * /notes/{noteId}:
 *   delete:
 *     summary: Delete a note
 *     description: Deletes a specific note based on its ID.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the note to delete
 *     responses:
 *       200:
 *         description: Note deleted successfully.
 *       500:
 *         description: Internal server error.
 */
noteRouter.delete("/:noteId",auth, isNoteAuthenticated, async (req,res)=>{
  //logic
  try {
    const { noteId } = req.params;
    const noteDelete = await NoteModel.findByIdAndDelete( noteId );
    res.status(200).json({msg:"note Deleted Successfully", noteDelete });
  } catch (error) {
    res.status(500).json({msg: "Internal Server Error", error})
  }  
})

module.exports = {noteRouter}