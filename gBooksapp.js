const csv = require('csv-parser');
const fs = require('fs');
const axios = require('axios');
const fetch = require('node-fetch');
const gBooks = require('google-books-search');

const bookInv = require('./books.json');

const sortedBooks = [];
const failedBooks = [];

let successCount = 0;
let errorCount = 0;


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

const gSearch = async function (bookData){
    let bookISBN = bookData['ISBN']
    let bookPrice = bookData['Price']
    
    console.log('82 Books Searched: ' + bookISBN)
    var gOptions = {
        key: '',
        field: 'isbn',
        offset: 0,
        limit: 10,
        type: 'books',
        order: 'relevance',
        lang: 'en'
    };


     await gBooks.search(bookISBN, gOptions, function(error, results){
       
        if(results[0]){
            let foundBook = {

                isbn: bookISBN,
                title: results[0].title ? results[0].title : '',
                author: results[0].authors,
                publisher: results[0].publisher,
                publishedDate: results[0].publishedDate,
                description: results[0].description,
                price: bookPrice,
                pageCount: results[0].pageCount,
                image: 'http://covers.openlibrary.org/b/isbn/' + bookISBN + '-L.jpg',
                categories: results[0].categories

            }
            printBooks('./cleanbooks.json', JSON.stringify(foundBook)+'\n');

        } else{
            printBooks('./failedbooks.json', JSON.stringify(bookData)+'\n');

            return null;

        }
    });
}


let cleanBooks = async () =>{

    for(i = 862; i < bookInv.length; i++){

        const book = bookInv[i];
        await gSearch(book)
            
    };
 
};
cleanBooks()

