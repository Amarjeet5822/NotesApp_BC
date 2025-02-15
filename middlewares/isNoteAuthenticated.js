const { NoteModel } = require("../models/note.models");

 
 const isNoteAuthenticated = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { userId } = req.user;
    const userNote = await NoteModel.findById( {_id: noteId});
    if(!userNote){
      return res.status(404).json({message:"Note not found"})
    }
    if(userNote.userId.toString() !== userId){
      return res.status(403).json({message:"You're not authorized"})
    }
    next();
    
  } catch (error) {
    res.status(500).json({msg: "Error from isNoteAuthenticated",error})
  }
 } 

 module.exports = { isNoteAuthenticated };