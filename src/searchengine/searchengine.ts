

const url = "https://betasearch.systementor.se";
const accessKey = "qLidn4cVx6dS8dhJ6zRCHw";
const secretKey = "7JByYAMA4aMbRLtCH8WdBauMfu_ENQ";

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

async function createIndex(index_name:string,language:string):Promise<void>{
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

