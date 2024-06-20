const express= require("express");
const app= express();
const mysql= require("mysql2");
const cors= require("cors");
const bodyParser = require("body-parser");
// var moment = require('moment');
const multer = require("multer");
const path = require("path");
var orm     = require('orm');
var builder = require('xmlbuilder');
var fs     = require('fs');
var dirPath = "./customer_data.xml";

const db = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: '',  // or 'your_password' if you set one
    database: "customer",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const storage= multer.diskStorage({
    destination:'./src/image/',
    filename:(req,file,cb) =>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    },
})

const upload= multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
      }
    });



app.get("/api/get",(req,res)=>{
    const sqlGet = "SELECT * FROM customer_data";
    
    db.query(sqlGet,(err,result)=>{
        res.send(result);
    });
    
});




app.post("/api/post",upload.single("pan"),(req,res)=>{

    let name= req.body.name;
    let dob= req.body.dob;
    let adhaar= req.body.adhaar;
    let pan= (req.file) ? req.file.filename : null;
    let cam=req.body.cam;
    let lat=req.body.lat;
    let long=req.body.long;

    const sqlPost = "INSERT INTO customer_data (name,dob,adhaar,pan,image,latitude,longitude) VALUES (?,?,?,?,?,?,?)";

    db.query(sqlPost,[name, dob, adhaar, pan, cam, lat, long],(error,result)=>{
        if(error){
            console.log(error);
        }
        else{
            res.send(result);
            console.log(result);
        }
    });    
});


app.delete("/api/remove/:id",(req,res)=>{
    const { id } = req.params;
    const sqlDelete = "DELETE FROM customer_data WHERE id = ? ";
    db.query(sqlDelete,id,(error,result)=>{
        if(error){
            console.log(error);
        }
    });    
});

app.get("/api/get/:id",(req,res)=>{
    const {id} = req.params;
    const sqlGet = "SELECT * FROM customer_data WHERE id = ?";
    db.query(sqlGet, id, (err,result)=>{
        if(err){
            console.log(err);
        }
        res.send(result);
        console.log(result);
    });

});

app.put("/api/update/:id",upload.single("pan"),(req,res)=>{
    const {id} = req.params;
    let name= req.body.name;
    let dob= req.body.dob;
    let adhaar= req.body.adhaar;
    let pan= (req.file) ? req.file.filename : null;
    let cam=req.body.cam;
    let lat=req.body.lat;
    let long=req.body.long;
    const sqlUpdate = "UPDATE customer_data SET name = ?, dob = ?, adhaar = ?, pan = ?, image = ?, latitude= ?, longitude= ? WHERE id = ?";
    db.query(sqlUpdate,[name, dob, adhaar, pan, cam, lat, long, id], (err,result)=>{
        if(err){
            console.log(err);
        }
        res.send(result);
    });

});

// app.get("/",(req,res)=>{
//     const sql= "INSERT INTO customer_data (name,dob,adhaar,pan) VALUES ('john','1990-03-10','123456787654','abc')";
//     db.query(sql,(error,result)=>{
//         console.log("error",error);
//         console.log("result",result);
//         res.send('Hello');
//     });
// });

app.use(orm.express("mysql://root:@localhost:/customer", {
	define: function (db, models, next) {
		models.customer = db.define("customer_data", { 
        name      : String,                
		dob       : String,
		adhaar    : String, 
		pan       : String,
        latitude  : String,
        longitude : String
              });
	    next();
	}
}));

app.get('/api/xml', function(req, res, next) {
     var xml = builder.create('customer');
     
     var result = req.models.customer.find({
            
      }, function(error, customer_data){
            if(error) throw error;
            for(var i=0; i < customer_data.length; i++){
                xml.ele('customer_data')
                .ele('name',customer_data[i]['name']).up()
                .ele('dob', customer_data[i]['dob']).up()
                .ele('adhaar', customer_data[i]['adhaar']).up()
                .ele('pan', customer_data[i]['pan']).up()
                .ele('latitude', customer_data[i]['latitude']).up()
                .ele('longitude', customer_data[i]['longitude']).end();
            }

            var xmldoc = xml.toString({ pretty: true }); 
            fs.writeFile(dirPath, xmldoc, function(err) {
                if(err) { return console.log(err); }
                console.log("The file is saved!");
                res.send("file created!");
            });
        });
    });

app.listen(5000, ()=>{
    console.log('port connected to 5000')
}) 
