 
 const isNoteAuthenticated = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { userId } = req.user;
    const userNote = await NoteModel.findById( noteId);
    if(!userNote){
      return res.status(404).json({message:"Note not found"})
    }
    if(userNote.userId.toString() === userId){
      next();
    }else{
      return res.status(403).json({message:"You're not authorized"})
    }
    
  } catch (error) {
    res.status(500).json({error})
  }
 } 

 module.exports = { isNoteAuthenticated };