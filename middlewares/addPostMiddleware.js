
const addPostMiddleware = (req, res, next ) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({msg: "Missing fields!"});
  }
  next();
};

module.exports = { addPostMiddleware };