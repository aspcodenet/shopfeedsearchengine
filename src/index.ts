import path from "path";
import * as fs from "fs";
import { getAllProducts, getProductId, updateProductDescription } from "./database/database";
import { exit } from "process";
import winston from "winston";
import { OpenObserveTransport } from "winston-transport-openobserve";
const { combine, timestamp, json } = winston.format;



const transport = new OpenObserveTransport({
  node: "https://api.openobserve.ai",
  organization: "2xMcS8bW3bMZHUO4VLOYOyrKlra",
  stream: "node-demo",
  auth: {
    username: "stefan.holmberg@systementor.se",
    password: "egQK930GAbrKyrSl",
  },
  batchSize:1, // Number of log messages to send in a single batch
});



const logger = winston.createLogger({
  level: 'info', 
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.Console(), 
    transport,
    new winston.transports.File({ filename: 'app.log' })
  ]
 });


logger.info('Starting the application...');
logger.info('This is an info message');


//var accessKey = 'PDsMUOHw78Og_J-gjGvujQ';
var accessKey= 'MHPD-epV-6ZygsphezEPxw';

//var secretKey='1KKc3cT5LTtRYckYKtPpCfe19H_P_Q';
var secretKey = 'sTcru3VjnlVs1fgDTY91hmT0otD8Cw';
//var url = "https://betasearch.systementor.se"
var url = "http://localhost:8080";
var index_name = "products-5";


async function deleteAll(){
var query = {
    query: {
      match_all: {},
  },
  from:0,
  size:500
};

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
    return
  }
  for(let i = 0; i  <  data.hits.hits.length;i++){
    console.log(data.hits.hits[i])
    await deleteDoc(data.hits.hits[i]._id)
  }
}

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

async function update(docid:string, product:any){

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


async function deleteDoc(docid:number){
  let headers = new Headers();

  headers.set('Authorization', 'Basic ' + Buffer.from(accessKey + ":" + secretKey).toString('base64'));
  headers.set('Content-Type', 'application/json' );



  const response = await fetch(url + `/api/index/v1/${index_name}/_doc/` + docid,{
    method:"DELETE",
      headers:headers
  });
  const data = await response.json() as any;
  console.log(data)
}



// Index Exisis
async function indexExists():Promise<boolean>{
  let headers = new Headers();

  headers.set('Authorization', 'Basic ' + Buffer.from(accessKey + ":" + secretKey).toString('base64'));
  headers.set('Content-Type', 'application/json' );

  const response = await fetch(url + `/api/index/v1/${index_name}`,{
    method:"HEAD",
      headers:headers
  });
  if(response.status == 200){
    return true
  }
  return false
}
// Drop Index
async function dropIndex():Promise<void>{
  let headers = new Headers();

  headers.set('Authorization', 'Basic ' + Buffer.from(accessKey + ":" + secretKey).toString('base64'));
  headers.set('Content-Type', 'application/json' );

  const response = await fetch(url + `/api/index/v1/${index_name}`,{
    method:"DELETE",
      headers:headers
  });
  if(response.status != 200){
    throw new Error("Could not drop index " + index_name)
  }
}
// Create Index
async function createIndex(language):Promise<void>{
  let headers = new Headers();

  headers.set('Authorization', 'Basic ' + Buffer.from(accessKey + ":" + secretKey).toString('base64'));
  headers.set('Content-Type', 'application/json' );

  const response = await fetch(url + `/api/index/v1/${index_name}`,{
    method:"PUT",
      headers:headers,
      body: `{
	"mappings": {      
  "properties": {
    "categoryName":{
      "type": "keyword"
    },
    "categoryid": {
      "type": "long"
    },
    "color": {
      "type": "keyword"
    },
    "combinedsearchtext": {
      "type": "text"
    },
    "description": {
      "type": "text"
    },
    "price": {
      "type": "long"
    },
    "stockLevel": {
      "type": "keyword"
    },
    "string_facet": {
      "type": "nested",
      "properties": {
        "facet_name": {
          "type": "keyword"
        },
        "facet_value": {
          "type": "keyword"
        }
      }
    },
    "title": {
      "type": "keyword"
    },
    "webid": {
      "type": "long"
    }
  }
},
	"settings": {
		"analysis": {
		"analyzer": {
			"default": {
			"type": "` + language + `"
			}
		}
		}
	}
	}` });
  if(response.status != 200){
  console.log(await response.text())
    throw new Error("Could not create index " + index_name)
  }
}




try {
  const ex = await indexExists();
  console.log("Index exists: " + ex);
  if(ex){
    // Drop index
    await dropIndex();
  } else{
    // Create index
  }
    await createIndex("english"); // swedish

  // console.log("Nu körs programmet")  
  await deleteAll()
  for(const product of await getAllProducts() ){
    console.log(product.id)  

    const searchObject = {
      "webid": product.id,
      "title": product.title,
      "description": product.description2,
      "combinedsearchtext" : product.title + " " + product.description2 + " " + product.color2 + " " + product.categoryName,
      "price": product.price,
      "categoryName": product.categoryname,
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

    const docId = await getDocumentIdOrUndefined(product.id.toString())
    if(docId != undefined){
      // DOC ID SKA SKICKAS IN inte product.id
      //UPDATE
      update(docId,searchObject)
    }else{
      //ADD 
      add(searchObject)
      
    }
}

  exit()
}catch (error) {
  console.error('An error occurred:', error);
  logger.error('An error occurred:', { error: error instanceof Error ? error.message : String(error) });
}















// for(const product of await getAllProducts() ){
//   console.log(product.id)  

//   const searchObject = {
//     "webid": product.id,
//     "title": product.title,
//     "description": product.description2,
//     "price": product.price,
//     "categoryName": product.categoryId,
//     "stockLevel": product.stockLevel,
//     "color": product.color2,
//     "categoryid": product.categoryId,
//     "string_facet": [
//       {
//         "facet_name": "Color",
//         "facet_value": product.color2
//       },
//       {
//         "facet_name": "Category",
//         "facet_value": product.categoryName
//       }
//     ]
//   };

//   const docId = await getDocumentIdOrUndefined(product.id.toString())
//   if(docId != undefined){
//     // DOC ID SKA SKICKAS IN inte product.id
//     //UPDATE
//     update(docId,searchObject)
//   }else{
//     //ADD 
//     add(searchObject)
    
//   }
// }

// exit()

// // console.log("Nu körs programmet")
// // type ProductData = {
// //     ProductName: string,
// //     Description:string,
// //     Color:string
// // };
// // // STEG 1 läs en rad i taget - få ProductData objekt och 
// // // skriv ut på console (TERMINALEN)

// // const csvFilePath = 'fake_products_unique.csv';
// // const headers = ['ProductName', 'Description', 'Color'];
// // const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });


// // parse(fileContent, {
// //     delimiter: ',',
// //     columns: headers,
// //   }, async (error, result: ProductData[]) => {
// //     for(const product of result){
// //         // kolla finns i databasen?
// //         if(product.ProductName === "ProductName"){
// //             continue
// //         }
// //         const prodId = await getProductId(product.ProductName)
// //         if(prodId === undefined){
// //             console.log(`Produkten ${product.ProductName} finns inte i vår databas`)
// //             continue;
// //         }
// //         // om så - uppdatera
// //         const produktensId = prodId.id
// //         updateProductDescription(produktensId,product.Description, product.Color) 
// //     }
// //     //console.log(result[1].ProductName)
// //     exit();
// //     }
// // );



// // // Steg 2 Fråga om id från databas  med denna title - updatera Databas

