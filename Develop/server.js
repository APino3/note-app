const express = require('express');
const path = require('path');
const fs = require('fs');
var cors = require('cors');
const { AsyncResource } = require('async_hooks');
const { randomFillSync } = require('crypto');
const app = express();

app.use(express.json());
app.use(cors());


app.use((req, res, next) =>{
	fs.appendFile("request.log", `${req.method} ${req.url}\n`, (err) => {
		if(err){
			console.log("couldnt write to file");
		}
	});
	next();
});





app.get('/api/notes', function (req, res) {
    fs.readFile("./db/db.json",(err,data) => {
      var notes = JSON.parse(data.toString());
      res.send(notes);
    });

});

app.post('/api/notes', function (req, res) {
  fs.readFile("./db/db.json", (err, data) => {
  	data = JSON.parse(data.toString());
    data.push(req.body);
    data = JSON.stringify(data, undefined, 2);
	fs.writeFile("./db/db.json", data, (err) => {
      if(err){
        res.status(400).send("failtosave");
        return;
      }
      res.status(200).send("savesuccessful");
    })
  })
});


app.delete('/api/notes/:id', function (req, res) {
  console.log("deleteing the note");
  var id = parseInt(req.params.id);
  fs.readFile("./db/db.json", (err, data) => {
  	data = JSON.parse(data.toString());
    data.splice(id,1);
    
    for(var i = 0; i < data.length; i++){
    	data[i].id = i;  
    }
    
    data = JSON.stringify(data, undefined, 2);
	fs.writeFile("./db/db.json", data, (err) => {
      if(err){
        res.status(400).send("failtosave");
        return;
      }
      res.status(200).send("savesuccessful");
    })
  })
});

app.post('/api/delete', function (req, res) {

  												
  
});


app.get('/api/read', function (req, res) {  

});


app.use(express.static(path.join(__dirname, './public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './public', 'index.html'));
  });
  
  app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, './public', 'notes.html'));
  });
  

app.listen(9000);