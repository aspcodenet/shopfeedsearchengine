import path from "path";
import * as fs from "fs";
import { getAllProducts, getProductId, updateProductDescription } from "./database/database";
import { exit } from "process";
import { indexExists } from "./searchengine/searchengine";

let index_name = "products-13";
// 1. Finns det ett index i betasearch.systementor.se som har mitt namn?
if(await indexExists(index_name) == false){
  createIndex(index_name,"english"); //swedish

}
// 2. Om inte - skapa !


const products = await getAllProducts();
for(const product of  products){
    console.log(product.id, product.title, product.categoryName);
};

function createIndex(index_name: string, arg1: string) {
  throw new Error("Function not implemented.");
}

