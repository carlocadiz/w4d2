
let argv = process.argv[2];
const pg = require("pg");
const settings = require("./settings"); // settings.json

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }
});

function peopleByName(name, callback){
  client.query(`SELECT * FROM famous_people WHERE first_name LIKE $1::text OR last_name LIKE $1::text`,[name], (err,results) => {
  if (err) {
      return console.error("error running query", err);
  }

  callback(null, results.rows);
  });
 }
function printResults(data){
  console.log('SEARCHING......');
  data.forEach(function(element,index){
  console.log(`Found ${data.length} person(s) with the name '${argv}':`);
  console.log(`-${index+1}: ${element.first_name} ${element.last_name}, born '${element.birthdate}'`);
});
}


peopleByName(argv,function(err, data) {
   printResults(data);
   client.end();
});
