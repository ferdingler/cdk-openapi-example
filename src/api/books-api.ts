import { Router } from "express";
import BooksCtrl from "../controllers/books-ctrl";

const bookApi = Router();

bookApi.post("/", BooksCtrl.createBook);

export default bookApi;
