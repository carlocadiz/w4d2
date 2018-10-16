var argv = process.argv.slice(2);

//console.log(argv.length);
//let argv = process.argv[2];
/*
if (argv.length === 0){
  console.log('DID NOT ENTER NAME FIELD');
  process.exit();
}*/

const settings = require("./settings"); // settings.json

const options ={
  client: 'pg',
  connection: {
    user     : settings.user,
    password : settings.password,
    database : settings.database,
    host     : settings.hostname,
    port     : settings.port,
    ssl      : settings.ssl
  }
};

const knex = require('knex')(options);


function peopleByName(name, callback){
  knex.select('*').from('famous_people')
  .where('first_name','=',name)
  .orWhere('last_name','=',name)
  .asCallback(function(err, results){
    if (err)
      return console.error("error running query", err);
    callback(err, results);
  });
}

function insertPerson(data1,data2,data3){
  knex('famous_people')
  .insert({ first_name: data1,
            last_name: data2,
            birthdate: data3 })
  .finally(() => {
        knex.destroy();
    });
 }

function printResults(data){
  console.log('SEARCHING......');
  data.forEach(function(element,index){
  console.log(`Found ${data.length} person(s) with the name '${argv}':`);
  console.log(`-${index+1}: ${element.first_name} ${element.last_name}, born '${element.birthdate}'`);
});
}



if (argv.length === 3){
  insertPerson(argv[0], argv[1], argv[2]);
} else if (argv.length === 1){
   peopleByName(argv[0],function(err, data) {
     printResults(data);
     knex.destroy();
   });
} else {
  console.log('NUMBER OF ARGUEMENT IS NOT VALID')
  process.exit();
}














