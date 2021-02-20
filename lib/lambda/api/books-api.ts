import { Router } from "express";
import BooksCtrl from "../controllers/books-ctrl";

/**
 * Handlers for Books api
 */
const bookApi = Router();

bookApi.post("/", BooksCtrl.createBook);

export default bookApi;
