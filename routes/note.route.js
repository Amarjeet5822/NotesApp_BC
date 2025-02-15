const express = require("express")
const {auth} = require("../middlewares/authMw")
const {NoteModel} = require("../models/note.models")
const { addPostMiddleware } = require("../middlewares/addPostMiddleware")
const { isNoteAuthenticated } = require("../middlewares/isNoteAuthenticated")
const noteRouter = express.Router()

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

noteRouter.get("/",auth, async (req,res)=>{
    try {
      const {userId } = req.user
      const notes = await NoteModel.find({ userId});
      res.status(200).json({notes})
    } catch(error) {
        res.status(500).json({msg:"Internal server error", error});
    }
})

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