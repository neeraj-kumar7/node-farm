const http = require('http');
const fs = require('fs');
const url = require('url');

//////////// FILE SYSTEM /////////////////////////////////////

/*
const hello = 'Hello World';
console.log(hello);

//blocking (synchronous)
const fs = require('fs');
const TextIn = fs.readFileSync('./1-node-farm/final/txt/input.txt', 'utf-8');
console.log(TextIn);

const TextOut = `This is what we know about avacado: ${TextIn}. created on ${Date.now()}`;
fs.writeFileSync('./1-node-farm/final/txt/test.txt', TextOut);
console.log('File Written!');


//non-blocking (asynchronous)
fs.readFile('./1-node-farm/final/txt/start.txt', 'utf-8', (err, data1) => {
    fs.readFile(`./1-node-farm/final/txt/${data1}.txt`, 'utf-8', (err, data2) => {
        console.log(data2);
        fs.readFile('./1-node-farm/final/txt/append.txt', 'utf-8', (err, data3) => {
            fs.writeFile('./1-node-farm/final/txt/final.txt', `${data2}\n${data3}`, 'utf-8', err =>{
                console.log('Your file has been Written!');
            });
        });
    });
});

console.log('Reading File');*/

/////////////// SIMPLE WEB SERVER //////////////////

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}


const server = http.createServer((req, res) => {
    console.log(req.url);
    const {query, pathname} = url.parse(req.url, true);
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {
            'Content-type': 'text/html'
        });

        const cardHtml = dataObj.map(element => replaceTemplate(tempCard, element));
        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardHtml);

        res.end(output);
    }
    else if(pathname === '/product'){

        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);

        res.end(output);
    }
    else if(pathname === '/api'){
        res.writeHead(200, {
            'Content-type': 'application/json'
        });

        res.end(data);
    }
    else{
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello world'
        });
        res.end('<h1>Page Not Found!</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening on port 8000');
});




