import { RowDataPacket } from "mysql2";
import { connection } from "./connection";

export interface ProductInfo extends RowDataPacket {
    id: number;
    title:string;
    price:number;
    stockLevel:number;
    color2:string;
    description2:string;
    categoryId:number;
    categoryName:string;
}

export interface ProductId extends RowDataPacket {
    id: number;
}


export async function getProductId(name:string) : Promise<ProductId|undefined>{
   // SELECT id * FROM Products WHERE title=productName
    const conn = await connection;
    
    const [rows] = await conn.query<ProductId[]>("SELECT id from Products where title=?", [name])
    if (rows.length == 0){
        return undefined
    }
    return rows[0]
}

export async function getAllProducts() : Promise<ProductInfo[]>{
   // SELECT id * FROM Products WHERE title=productName
    const conn = await connection;
    
    const [rows] = await conn.query<ProductInfo[]>("SELECT p.id,title, p.price,p.stockLevel,p.color2, p.description2, p.categoryId, c.name as categoryName from Products p JOIN Category c on c.id=p.categoryId")    
    return rows
}


export async function updateProductDescription(id:number, description:string, color:string){
    // vi hjar ju skapat en koklumn i Products spom heter description2
    // också en som heter color2
    const conn = await connection;
    await conn.execute("UPDATE Products SET description2=?, color2=? WHERE id=?",[description,color,id])

}