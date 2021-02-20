import { Request, Response } from "express";

function createBook(req: Request, res: Response) {
  console.log("CreateBook function in BooksController");
  const { bookName, ISBN, author } = req.body;
  return res.json({
    bookName: bookName,
    ISBN: ISBN,
    author: author,
  });
}

export default {
  createBook,
};
