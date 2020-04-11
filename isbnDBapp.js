const fs = require('fs');
const fetch = require('node-fetch');
require("dotenv").config();

const bookInv = require('./books.json');

const sortedBooks = [];
const failedBooks = [];

let readCount = 0;


const storeData = (data, path) => {
    try {
        fs.writeFile(path, JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}
async function getBookDetails(row) {

    // // Query the book database by ISBN code.
    // let isbn = row["ISBN"];
    // let url = 'https://api2.isbndb.com/book/' + isbn;
    
    // let headers = {
    //     "Content-Type": 'application/json',
    //     "Authorization": '43935_0fed7ebcc77606c89c5fb6af9c90153f'
    // };
    
    // try{
    //     let response = await fetch(url, {headers: headers});
    //     let data = await response.json();
    //     sortedBooks.push(data.book)
    // }catch(error) {
    //         errorCount++;
    //         console.error('ErrorCount ' + errorCount + ' | Error:', error)
    //         failedBooks.push(row);
    // }
    // finally{

    // } 
   

    }

// const iterateRows = () =>
//     new Promise((resolve, reject) => {
//         const promises = [];
//         fs.createReadStream(filePath)
//             .pipe(csv())
//             .on('data', (row) => {
//                 console.log(row)
//                 let b = JSON.parse(row)
//                 console.log(b['ISBN']);
//                 promises.push(getBookDetails(row));
//             })
//             .on('end', async () => {
//                 await Promise.all(promises);
//                 resolvec();
//             });
//     });

// iterateRows();

function printBooks(path, data) {
    fs.appendFile(path, data, (err)=> {
        if (err) {
            console.error(err)
        }
    });
}

function appendBook(path, book){
    fs.readFile(path, 'utf-8', function(err, data) {
        if (err) throw err
    
        var arrayOfObjects = JSON.parse(data)
        arrayOfObjects.push(book)    
        fs.writeFile(path, JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
            if (err) throw err
            readCount++            
            console.log('Done! ' + readCount + 'books read')
        })
    })
}

const isbnDBSearch = async function (bookData){
    let bookISBN = bookData['ISBN']
    let bookPrice = bookData['Price']
    
    console.log('Book Searched: ' + bookISBN)


    let headers = {
        "Content-Type": 'application/json',
        "Authorization": process.env.ISBNdb_key
    }
     
    await fetch('https://api2.isbndb.com/book/' + bookISBN, {headers: headers})
        .then(response => {
            return response.json();
        })
        .then(json => {

            let foundBook = {

                        isbn: bookISBN,
                        title: json.book.title,
                        author: json.book.authors,
                        publisher: json.book.publisher,
                        publishedDate: json.book.date_published,
                        description: json.book.description ? json.book.description : '',
                        binding: json.book.binding,
                        price: bookPrice < json.book.msrp ? json.book.msrp : bookPrice,
                        pageCount: json.book.pages,
                        image: json.book.image ? json.book.image : 'http://covers.openlibrary.org/b/isbn/' + bookISBN + '-L.jpg',
                        categories: json.book.categories
        
                    }
            printBooks('./isbnDBsuccess.json', JSON.stringify(foundBook)+'\n');
        })
        .catch(error => {
            printBooks('./isbnDBfail.json', JSON.stringify(bookData)+'\n');
            console.log(error)
        });
       
       
    };

let cleanBooks = async () =>{

    for(i = 0; i < bookInv.length; i++){

        const book = bookInv[i];
        await isbnDBSearch(book)
            
    };
 
};
cleanBooks()

