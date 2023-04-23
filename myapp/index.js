const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "goodreads.db");

let db = null;

const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is Running");
    });
  } catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
};

initializeDBandServer();

// GET BOOKS API

app.get("/books/", async (request, response) => {
  const getAllBooksQuery = `SELECT * 
    FROM book ;`;
  const getAllBooks = await db.all(getAllBooksQuery);
  response.send(getAllBooks);
});

//GET BOOK API

app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;

  const getSingleBookQuery = `SELECT * 
      FROM book 
      WHERE book_id = ${bookId}`;

  const getSingleBook = await db.get(getSingleBookQuery);
  response.send(getSingleBook);
});

//ADD BOOK API

app.post("/books/", async (request, response) => {
  const bookDetails = request.body;
  const {
    title,
    authorId,
    rating,
    reviewCount,
    ratingCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = bookDetails;

  const addingBookQuery = `
    INSERT INTO 
        book (title,
            author_id,
            rating,
            review_count,
            rating_count,
            description,
            pages,
            date_of_publication,
            edition_language,
            price,
            online_stores)
        
        VALUES (
            '${title}',
            '${authorId}',
            '${rating}',
            '${reviewCount}',
            '${ratingCount}',
            '${description}',
            '${pages}',
            '${dateOfPublication}',
            '${editionLanguage}',
            '${price}',
            '${onlineStores}'
        );`;

  const addingBook = await db.run(addingBookQuery);
  const bookId = addingBook.lastID;
  response.send({ bookId: bookId });
});

//UPDATE BOOK API

app.put("/books/:bookId/", async (request, response) => {
  const bookDetails = request.body;
  const { bookId } = request.params;
  const {
    title,
    authorId,
    rating,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = bookDetails;
  const updateBookQuery = `
    UPDATE 
        book
    SET 
        title='${title}',
        author_id= ${authorId},
        rating= ${rating},
        rating_count = ${ratingCount},
        review_count = ${reviewCount},
        description = '${description}',
        pages = ${pages},
        date_of_publication='${dateOfPublication}',
        edition_language = '${editionLanguage}',
        price=${price},
        online_stores = '${onlineStores}'
    WHERE book_id = ${bookId};`;
  const updatedBook = await db.run(updateBookQuery);
  response.send("Book Updated Successfully!");
});

//DELETE BOOK API

app.delete("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;

  const deletedBookQuery = `
    DELETE FROM 
    book 
    WHERE book_id = ${bookId};`;

  await db.run(deletedBookQuery);
  response.send("Book Deleted Successfully!");
});

//GET AUTHOR BOOKS

app.get("/authors/:authorId/books/", async (request, response) => {
  const { authorId } = request.params;

  const getAuthorBooksQuery = `
    SELECT * 
    FROM book 
    WHERE author_id = ${authorId};`;

  const getAuthorBooks = await db.get(getAuthorBooksQuery);
  response.send(getAuthorBooks);
});
