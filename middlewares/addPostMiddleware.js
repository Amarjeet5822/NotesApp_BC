
const addPostMiddleware = (req, res, next ) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({msg: "Missing fields!"});
  }
  next();
};

module.exports = { addPostMiddleware };