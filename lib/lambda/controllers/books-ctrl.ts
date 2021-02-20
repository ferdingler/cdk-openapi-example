import { Request, Response } from "express";

function createBook(req: Request, res: Response) {
  return res.json({
    bookName: "Domain Driven Design",
    ISBN: "0-321-12521-5",
    author: "Eric Evans",
  });
}

export default {
  createBook,
};
