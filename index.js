const {WOQLClient} = require("@terminusdb/terminusdb-client");

const json_schema =[
    {
       "@base": "terminusdb:///data/",
       "@schema": "terminusdb:///schema#",
       "@type": "@context"
   },
    {
       "@type":"Class",
       "@id":"Station",
       "@base":"Station_",
       "@key":{
          "@type":"Lexical",
          "@fields":[
             "station_number"
          ]
       },
       "station_number":"xsd:decimal",
       "address":"xsd:string"
    },
    {
       "@type":"Class",
       "@id":"Bike",
       "@base":"Bike_",
       "@key":{
          "@type":"Lexical",
          "@fields":[
             "bike_number"
          ]
       },
       "bike_number":"xsd:string"
    },
    {
       "@type":"Class",
       "@id":"Journey",
       "@base":"Journey_",
       "@key":{
          "@type":"Lexical",
          "@fields":[
             "bike",
             "start_station",
             "end_station",
             "start_time",
             "end_time"
          ]
       },
       "bike":"Bike",
       "start_station":"Station",
       "end_station":"Station",
       "start_time":"xsd:dateTime",
       "end_time":"xsd:dateTime"
    }
 ]

const server="http://localhost:6363"

const client = new WOQLClient(server,{user:'admin',organization:'admin',key:"root"})

const bikeDB = "Bike_test001"

client.createDatabase(bikeDB, {label: "My Bike", comment: "Create bike"})
//client.deleteDatabase(bikeDB)

client.addDocument(json_schema,{graph_type:"schema"})