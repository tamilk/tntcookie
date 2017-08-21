var express = require('express');

var router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = 'postgres:postgres@localhost:5432/tntcook';

//console.log('process.env---',process.env);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/createCookie', function(req, res, next) {
  const client = new pg.Client(connectionString);
	client.connect();
	console.log("create table--");
	const query = client.query(
	  'CREATE TABLE psegcook(id SERIAL PRIMARY KEY, mboxMCGVID  VARCHAR(40), p_seg_value VARCHAR(40))');
	query.on('end', () => {
		client.end();
		return res.json({create:'done'});
	});
});
router.post('/api/checkCookie', (req, res, next) => {
  const results = [];
  console.log("request body", req.body);
  const data =  req.body;
  pg.connect(connectionString, (err, client, done) => {
    if(err) {
      done();
      console.log("err----------",err);
      return res.status(500).json({success: false, data: err});
    }

    const query = client.query('INSERT INTO psegcook(mboxMCGVID, p_seg_value) values($1, $2)', [data.mboxMCGVID, data.p_seg_value]);
    query.on('end', () => {
      done();
      return res.json(results);
    });
	//const query = client.query('SELECT * FROM psegcook');
    //query.on('row', (row) => {
      //results.push(row);
    //});
  });
});
module.exports = router;
