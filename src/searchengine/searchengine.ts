

const url = "https://betasearch.systementor.se";
const accessKey = "qLidn4cVx6dS8dhJ6zRCHw";
const secretKey = "7JByYAMA4aMbRLtCH8WdBauMfu_ENQ";

export async function update(index_name:string,docid:string, product:any){

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


export async function getDocumentIdOrUndefined(index_name:string,webId:string):Promise<string|undefined>{
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


export async function add(index_name:string,product:any){

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


export async  function indexExists(index_name:string):Promise<boolean>{
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

export  async function createIndex(index_name:string,language:string):Promise<void>{
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


export async function dropIndex(index_name:string):Promise<void>{
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



export async function deleteAll(index_name:string):Promise<void>{
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
    await deleteDoc(index_name,data.hits.hits[i]._id)
  }
}

export async function deleteDoc(index_name:string,docid:number){
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


