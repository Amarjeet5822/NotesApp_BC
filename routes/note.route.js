const express = require("express")
const {auth} = require("../middlewares/authMw")
const {NoteModel} = require("../models/note.models")
const noteRouter = express.Router()

noteRouter.post("/", auth,async (req,res)=>{
    try {
        const newNote = new NoteModel(req.body);
        await newNote.save();
        res.status(200).json({msg:"Note created Successfully!"});
    } catch(error) {
        console.log(error.message)
        res.status(500).json({msg:"Internal server error", error});
    }
})

noteRouter.get("/",auth, async (req,res)=>{
    try {
        const notes = await NoteModel.find({userId: req.body.userId});
        res.status(200).json({notes})
    } catch(error) {
        res.status(500).json({msg:"Internal server error", error});
    }
})

noteRouter.patch("/:noteId",auth, async (req,res)=>{
  try {
    const { noteId } = req.params;
    const { userId } = req.user;
    const { ...updateData } = req.body;
    console.log("noteId:", noteId);
    console.log("updateData: ", updateData);
    const userNote = await NoteModel.findById( noteId);
    if(!userNote){
      return res.status(404).json({message:"not found"})
    }
    console.log("userNote.userId", userNote.userId, `userId : ${userId}`);
    if(userNote.userId.toString() === userId){
      const updatedNote = await NoteModel.findByIdAndUpdate( noteId, req.body, {new: true});
      return res.status(201).json({ message:"Note updated successfully!", updatedNote })
    }else{
      return res.status(403).json({message:"You're not authorized"})
    }
    
  } catch (error) {
    res.status(500).json({error})
  }
})

noteRouter.delete("/:noteId",auth, async (req,res)=>{
  //logic
  try {
    const { noteId } = req.params;
    const { userId } = req.user;
    const userNote = await NoteModel.findById(noteId);
    if(!userNote){
      return res.status(404).json({message:"not found"})
    }
    if(userNote.userId.toString() === userId ){
      const noteDelete = await NoteModel.findByIdAndDelete( noteId );
      return res.status(200).json({msg:"note Deleted Successfully", noteDelete });
    } else{
      return res.status(404).json({msg: "You're Unauthorized!"})
    }
  } catch (error) {
    res.status(500).json({msg: "Internal Server Error", error})
  }  
})

module.exports = {noteRouter}