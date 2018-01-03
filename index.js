var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const logger = require('morgan');

let pg = require('pg');

let pool = new pg.Pool({
	port:5432,
	database:'enrolment',
	user:'postgres',
	host:'192.168.5.146',
	password:'root',
	max:1000
});
router.use(logger('dev'));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));

router.use(function(request, response, next){
	response.header("Access-Control-Allow-Origin","*");
	response.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type, Accept");
	next();
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/sample', function(req, res){
 res.send('hello from sample')
});

router.get('/room',function(req, res){
	pool.connect((err,db,done) => {
	if(err) {
	console.log(err)
	}
	else{
		db.query('SELECT * from room',(err,table) => {
		if(err){
		console.log(err);
		}
		else{
		db.end();
		res.send(table.rows);
		}
   	  })
	 }
	})
});

router.post('/checkRoom',function(req, res){

	var room = req.body.room;

	pool.connect((err,db,done) => {
	if(err) {
	console.log(err)
	}
	else{
		db.query('SELECT * from room WHERE upper(room) = upper($1)',[room],(err,table) => {
		if(err){
		console.log(err);
		}
		else{
			db.end();
			var count = table.rows.length;
			if(count>0){
				res.send({"message":"exist"});
			}
			else{
				res.send({"message":"ok"});
			}

		}
   	  })
	 }
	})

});
router.post('/addRoom',function(request,response){
	var room = request.body.room;
  	var building = request.body.bldg;
  	var capacity = request.body.capacity;
  	var type = request.body.rtype;

	pool.connect((err,db,done) =>{
    if(err) {
      return console.log(err);
    }
    else {
      db.query('INSERT INTO room(room,bldg,capacity,rtype) VALUES ($1,$2,$3,$4)',[room,building,capacity,type],(err,table) => {
      done();
      if(err){
        console.log(err);
       return response.send({"message":"error"});
      }
      else {
        return response.status(200).send({"message":"success"});
        db.end();
      }
     })
  		// return response.status(200).send(startdate);
    }
  	}) // end pool
});

router.post('/updateRoom',function(request,response){
		var room = request.body.room;
		var oldBuilding = reques.body.oldbldg;
  	var building = request.body.bldg;
  	var capacity = request.body.capacity;
  	var type = request.body.rtype;

		var isNull = capacity.length;

  	pool.connect((err,db,done) =>{
    if(err) {
      return console.log(err);
    }
    else {
			if(isNull === 0 ){
				 var capacity = null;
				 db.query('UPDATE room SET bldg = $1, capacity = $2, rtype = $3 WHERE room = $4 AND bldg = $5',[building,capacity,type,room,oldBuilding],(err,table) => {
	       done();
	       if(err){
	        console.log(err);
	        return response.send({"message":"error"});
	       }
	       else {
	         return response.send({"message":"success"});
	         db.end();
	       }
	      })
			}
			else{
				 var capacity = request.body.capacity;
				 db.query('UPDATE room SET bldg = $1, capacity = $2, rtype = $3 WHERE room = $4 AND bldg = $5',[ building,capacity,type,room,oldBuilding],(err,table) => {
	       done();
	       if(err){
	         console.log(err);
	        return response.send({"message":"error"});
	       }
	       else {
	         return response.send({"message":"success"});
	         db.end();
	       }
	      })
			}
     //  db.query('UPDATE room SET room = $1, bldg = $2, capacity = $3, rtype = $4 WHERE room = $5',[room,building,capacity,type,room],(err,table) => {
     //  done();
     //  if(err){
     //    console.log(err);
     //   return response.send({"message":"error"});
     //  }
     //  else {
     //    return response.status(200).send({"message":"success"});
     //    db.end();
     //  }
     // })
  		// return response.status(200).send(startdate);
    }
  })
});

router.get('/building',function(req, res){
	pool.connect((err,db,done) => {
	if(err) {
	console.log(err)
	}
	else{
		db.query('SELECT * from building',(err,table) => {
		if(err){
		console.log(err);
		}
		else{
		db.end();
		res.send(table.rows);
		}
   	  })
	 }
	})
});

router.get('/bldg',function(req, res){
	pool.connect((err,db,done) => {
	if(err) {
	console.log(err)
	}
	else{
		db.query('SELECT * from building',(err,table) => {
		if(err){
		console.log(err);
		}
		else{
		db.end();
		res.send(table.rows);
		}
   	  })
	 }
	})
});

router.get('/term', function(req, res) {
  pool.connect((err,db,done)=>{
    if(err){
      console.log(err);
    }
    else {
      db.query('SELECT * from sysem ORDER BY sysemno ASC', (err,table) =>{
        if(err){
          console.log(err);
        }
        else {
          db.end();
          res.send(table.rows);
        }
      })
    }
  })
});
router.post('/addTerm',function(request,response){
	var sy = request.body.sy;
  	var sem = request.body.sem;
  	var sysemno = request.body.sysemno;
  	var startdate = request.body.startdate;
  	var enddate = request.body.enddate;
  	var startclass = request.body.startclass;
  	var grade_submit = request.body.grade_submit;
  	var grade_submit_fin = request.body.grade_submit_fin;
	var inc_expiration = request.body.inc_expiration;

	if(startdate == ''){
		startdate = null;
	}
	if(enddate == ''){
		enddate = null;
	}
	if(startclass == ''){
		startclass = null;
	}
	if(grade_submit == ''){
		grade_submit = null;
	}
	if(grade_submit_fin == ''){
		grade_submit_fin = null;
	}
	if(inc_expiration == ''){
		inc_expiration = null;
	}

	pool.connect((err,db,done) =>{
    if(err) {
      return console.log(err);
    }
    else {
      db.query('INSERT INTO sysem(sy,sem,sysemno,startdate,enddate,startclass,grade_submit,grade_submit_fin,inc_expiration) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',[sy,sem,sysemno,startdate,enddate,startclass,grade_submit,grade_submit_fin,inc_expiration],(err,table) => {
      done();
      if(err){
        console.log(err);
       return response.send({"message":"error"});
      }
      else {
        return response.status(200).send({"message":"success"});
        db.end();
      }
     })
  		// return response.status(200).send(startdate);
    }
  	}) // end pool
});

router.post('/updateTerm',function(request,response){
	var sy = request.body.sy;
  	var sem = request.body.sem;
  	var sysemno = request.body.sysemno;
  	var startdate = request.body.startdate;
  	var enddate = request.body.enddate;
  	var startclass = request.body.startclass;
  	var grade_submit = request.body.grade_submit;
  	var grade_submit_fin = request.body.grade_submit_fin;
	var inc_expiration = request.body.inc_expiration;
	var sysemno = request.body.sysemno;

	if(startdate == ''){
		startdate = null;
	}
	if(enddate == ''){
		enddate = null;
	}
	if(startclass == ''){
		startclass = null;
	}
	if(grade_submit == ''){
		grade_submit = null;
	}
	if(grade_submit_fin == ''){
		grade_submit_fin = null;
	}
	if(inc_expiration == ''){
		inc_expiration = null;
	}

  	pool.connect((err,db,done) =>{
    if(err) {
      return console.log(err);
    }
    else {
      db.query('UPDATE sysem SET sy = $1, sem = $2,sysemno = $3, startdate = $4, enddate = $5, startclass = $6, grade_submit = $7, grade_submit_fin = $8, inc_expiration = $9 WHERE sysemno = $10',[sy,sem,sysemno,startdate,enddate,startclass,grade_submit,grade_submit_fin,inc_expiration,sysemno],(err,table) => {
      done();
      if(err){
        console.log(err);
       return response.send({"message":"error"});
      }
      else {
        return response.status(200).send({"message":"success"});
        db.end();
      }
     })
  		// return response.status(200).send(startdate);
    }
  })
});
router.get('/program', function(req, res) {
  pool.connect((err,db,done)=>{
    if(err){
      console.log(err);
    }
    else {
      db.query('SELECT * from program', (err,table) =>{
        if(err){
          console.log(err);
        }
        else {
          db.end();
          res.send(table.rows);
        }
      })
    }
  })
});
router.get('/college', function(req, res) {
  pool.connect((err,db,done)=>{
    if(err){
      console.log(err);
    }
    else {
      db.query('SELECT * from college', (err,table) =>{
        if(err){
          console.log(err);
        }
        else {
          db.end();
          res.send(table.rows);
        }
      })
    }
  })
});
router.post('/addCollege',function(request,response){
  var colcode = request.body.colcode;
  var college = request.body.college;
  var empid = request.body.empid;

  pool.connect((err,db,done) =>{
    done();
    if(err){
      return response.status(400).send(err);
    }else{
      db.query('INSERT INTO college (colcode,college,empid) VALUES ($1,$2,$3)', [colcode,college,empid], (err,table) => {
        if(err){
					console.log(err);
          return response.send({"message":"error"});
        }else{
          return response.send({"message":"success"});
        }
      })
    }
  })
});
router.get('/collegeName', function(req, res) {
  pool.connect((err,db,done)=>{
    if(err){
      console.log(err);
    }
    else {
      db.query('SELECT distinct colcode,college from college', (err,table) =>{
        if(err){
          console.log(err);
        }
        else {
          db.end();
          res.send(table.rows);
        }
      })
    }
  })
});
router.post('/updateCollege',function(request,response){
	var colcode = request.body.colcode;
	var colcodeNew = request.body.colcodeNew;
  var college = request.body.college;
  var empid = request.body.empid;


  	pool.connect((err,db,done) =>{
    if(err) {
      return console.log(err);
    }
    else {
      db.query('UPDATE college SET colcode = $1, college = $2, empid = $3 WHERE colcode = $4',[colcodeNew,college,empid,colcode],(err,table) => {
      done();
      if(err){
        console.log(err);
       return response.send({"message":"error"});
      }
      else {
        return response.status(200).send({"message":"success"});
        db.end();
      }
     })
  		// return response.status(200).send(startdate);
    }
  })
});
router.get('/department', function(req, res) {
  pool.connect((err,db,done)=>{
    if(err){
      console.log(err);
    }
    else {
      db.query('SELECT * from department', (err,table) =>{
        if(err){
          console.log(err);
        }
        else {
          db.end();
          res.send(table.rows);
        }
      })
    }
  })
});
router.get('/departmentName', function(req, res) {
  pool.connect((err,db,done)=>{
    if(err){
      console.log(err);
    }
    else {
      db.query("SELECT deptname,deptcode from department WHERE deptname != '' ", (err,table) =>{
        if(err){
          console.log(err);
        }
        else {
          db.end();
          res.send(table.rows);
        }
      })
    }
  })
});
router.get('/COLLEGEandDEPARTMENT', function(req, res) {
  pool.connect((err,db,done)=>{
    if(err){
      console.log(err);
    }
    else {
      db.query("SELECT deptcode,deptname,colcode,college.college,college.empid from college,department where college.colcode=department.college;", (err,table) =>{
        if(err){
          console.log(err);
        }
        else {
          db.end();
          res.send(table.rows);
        }
      })
    }
  })
});

router.post('/addDepartment',function(request,response){
	var deptcode = request.body.deptcode;
	var deptname = request.body.deptname;
  var active = request.body.active;
	var college = request.body.college;
  var empid = request.body.empid;

  let values = [deptcode,deptname,active,college,empid];
  pool.connect((err,db,done) =>{
    done();
    if(err){
      return response.status(400).send(err);
    }else{
      db.query('INSERT into department (deptcode,deptname,active,college,empid)values($1,$2,$3,(select colcode from college where college.college = $4),$5)', [...values], (err,table) => {
        if(err){
          return response.status(400).send(err);
					console.log(err);
        }else{
          console.log('Department inserted');
          response.status(201).send({message:'Data inserted'});
        }
      })
    }
  })
});

router.post('/updateDepartment',function(request,response){
	var deptcode = request.body.deptcode;
	var deptname = request.body.deptname;
  var active = request.body.active;
	var college = request.body.college;
  var empid = request.body.empid;

	let values = [deptcode,deptname,active,college,empid];
	console.log(values);
  pool.connect((err,db,done) =>{
    done();
    if(err){
      return response.status(400).send(err);
			console.log(values);
    }else{
      db.query('UPDATE department SET deptname=$2,active=$3,college=(SELECT colcode FROM college WHERE college= $4 ),empid=$5  WHERE deptcode=$1', [...values], (err,table) => {
        if(err){
          return response.status(400).send(err);
					console.log(err);
					console.log(values);
        }else{
          console.log('Data updated');
          response.status(201).send({message:'Data updated'});
        }
      })
    }
  })
});


router.post('/addProgram',function(request,response){
	var progcode = request.body.progcode;
	var progdesc = request.body.progdesc;
  var is_active = request.body.is_active;
	var undergrad = request.body.undergrad;
  var progdept = request.body.progdept;
  var major = request.body.major;
	var masteral = request.body.masteral;
	var phd = request.body.phd;
	var shorthand = request.body.shorthand;

	let values= [progcode,progdesc,is_active,undergrad,progdept,major,masteral,phd,shorthand];

  pool.connect((err,db,done) =>{
    done();
    if(err){
      return response.status(400).send(err);
    }else{
      db.query('INSERT into program (progcode,progdesc,is_active,undergrad,progdept,major,masteral,phd,college,shorthand)values($1,$2,$3,$4,(SELECT deptcode from department WHERE deptname = $5),$6,$7,$8,(select college from department where deptcode = $5 ), $9)', [...values], (err,table) => {
        if(err){
          return response.status(400).send(err);
					console.log(err);
					console.log(values);
        }else{
          console.log('Program inserted');
          response.status(201).send({message:'Data inserted'});
        }
      })
    }
  })
});
router.post('/updateProgram',function(request,response){
	var progcode = request.body.progcode;
	var progdesc = request.body.progdesc;
  var is_active = request.body.is_active;
	var undergrad = request.body.undergrad;
  var progdept = request.body.progdept;
  var major = request.body.major;
	var masteral = request.body.masteral;
	var phd = request.body.phd;
	var shorthand = request.body.shorthand;

	let values= [progcode,progdesc,is_active,undergrad,progdept,major,masteral,phd,shorthand];
	console.log(values);
  pool.connect((err,db,done) =>{
    done();
    if(err){
      return response.status(400).send(err);
			console.log(values);
    }else{
      db.query('UPDATE program SET progdesc=$2,is_active=$3,undergrad=$4,progdept=(SELECT deptcode from department WHERE deptname = $5),major=$6,masteral=$7,phd=$8,college=(SELECT college FROM department WHERE deptcode = $5),shorthand=$9  WHERE progcode=$1', [...values], (err,table) => {
        if(err){
          return response.status(400).send(err);
					console.log(err);
					console.log(values);
        }else{
          console.log('Data updated');
          response.status(201).send({message:'Data updated'});
        }
      })
    }
  })
});
router.get('/coldept', function(req, res) {
  pool.connect((err,db,done)=>{
    if(err){
      console.log(err);
    }
    else {
      db.query("SELECT college.colcode,college.college from college INNER JOIN department ON college.college = department.college", (err,table) =>{
        if(err){
          console.log(err);
        }
        else {
          db.end();
          res.send(table.rows);
        }
      })
    }
  })
});

module.exports = router;
