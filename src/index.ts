import path from "path";
import * as fs from "fs";
import { getAllProducts, getProductId, updateProductDescription } from "./database/database";
import { exit } from "process";


async function getDocumentIdOrUndefined(webId:string):Promise<string|undefined>{
  var query = {
    query: {
      term: {
        webid: webId,
    },
  }};

  let headers = new Headers();

  headers.set('Authorization', 'Basic ' + Buffer.from(accessKey + ":" + secretKey).toString('base64'));
  headers.set('Content-Type', 'application/json' );

  const response = await fetch(url + `/api/index/v1/${index_name}/_search`,{
    method:"POST",
      headers:headers,
      body:JSON.stringify(query)
  });
  const data = await response.json() as any;
  if(data.hits.total.value == 0){
    return undefined
  }
  return data.hits.hits[0]._id
}


async function add(product:any){

  let headers = new Headers();

  headers.set('Authorization', 'Basic ' + Buffer.from(accessKey + ":" + secretKey).toString('base64'));
  headers.set('Content-Type', 'application/json' );

  const response = await fetch(url + `/api/index/v1/${index_name}/_doc`,{
    method:"POST",
      headers:headers,
      body:JSON.stringify(product)
  });
  const data = await response.json() as any;
  console.log(data)
}

async function update(docid:number, product:any){

  let headers = new Headers();

  headers.set('Authorization', 'Basic ' + Buffer.from(accessKey + ":" + secretKey).toString('base64'));
  headers.set('Content-Type', 'application/json' );



  const response = await fetch(url + `/api/index/v1/${index_name}/_doc/` + docid,{
    method:"POST",
      headers:headers,
      body:JSON.stringify(product)
  });
  const data = await response.json() as any;
  console.log(data)
}






var accessKey = 'PDsMUOHw78Og_J-gjGvujQ';
var secretKey='1KKc3cT5LTtRYckYKtPpCfe19H_P_Q';
var url = "https://betasearch.systementor.se"
var index_name = "products-12";


for(const product of await getAllProducts() ){
  console.log(product.id)  

  const searchObject = {
    "webid": product.id,
    "title": product.title,
    "description": product.description2,
    "price": product.price,
    "categoryName": product.categoryId,
    "stockLevel": product.stockLevel,
    "color": product.color2,
    "categoryid": product.categoryId,
    "string_facet": [
      {
        "facet_name": "Color",
        "facet_value": product.color2
      },
      {
        "facet_name": "Category",
        "facet_value": product.categoryName
      }
    ]
  };

  const docId = await getDocumentIdOrUndefined(product.id)
  if(docId != undefined){
    // DOC ID SKA SKICKAS IN inte product.id
    //UPDATE
    update(docId,searchObject)
  }else{
    //ADD 
    add(searchObject)
    
  }
}


// console.log("Nu körs programmet")
// type ProductData = {
//     ProductName: string,
//     Description:string,
//     Color:string
// };
// // STEG 1 läs en rad i taget - få ProductData objekt och 
// // skriv ut på console (TERMINALEN)

// const csvFilePath = 'fake_products_unique.csv';
// const headers = ['ProductName', 'Description', 'Color'];
// const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });


// parse(fileContent, {
//     delimiter: ',',
//     columns: headers,
//   }, async (error, result: ProductData[]) => {
//     for(const product of result){
//         // kolla finns i databasen?
//         if(product.ProductName === "ProductName"){
//             continue
//         }
//         const prodId = await getProductId(product.ProductName)
//         if(prodId === undefined){
//             console.log(`Produkten ${product.ProductName} finns inte i vår databas`)
//             continue;
//         }
//         // om så - uppdatera
//         const produktensId = prodId.id
//         updateProductDescription(produktensId,product.Description, product.Color) 
//     }
//     //console.log(result[1].ProductName)
//     exit();
//     }
// );



// // Steg 2 Fråga om id från databas  med denna title - updatera Databas

