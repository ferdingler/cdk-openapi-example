import * as express from "express";
import booksApi from "./books-api";

const app = express();

app.use("/book", booksApi);

export default app;
