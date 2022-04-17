let express = require('express');
let app = express();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const dotenv = require('dotenv');
dotenv.config()
let port = process.env.PORT || 8530;
const mongoLiveurl = "mongodb+srv://Aboli:aboli123@cluster0.zdz7v.mongodb.net/zomatodb?retryWrites=true&w=majority";
const bodyParser = require(`body-parser`);
const cors = require(`cors`);


// middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use(cors())

app.get('/',(req,res) => {
    res.send("Welcome to Express")
})


//Subject categories
app.get('/category',(req,res) => {
    db.collection('category').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//level
app.get('/level',(req,res) => {
    // let id = req.params.id;
    // let id  = req.query.id
    // console.log(">>>id",id)
    let query = {};
    let categoryid = Number(req.query.category_id)
    let id = Number(req.query.id)
    if(categoryid){
        query = {category_id:categoryid}
    }else if(id){
        query = {id:id}
    }

    db.collection('level').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})
//details
app.get('/details',(req,res) => {
    let categoryid = Number(req.query.categoryid)
    let levelid = Number(req.query.levelid)
    if(categoryid){
        query = {category_id:categoryid}
    }else if(levelid){
        query = {level_id:levelid}
    }

    db.collection('leveldetails').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})
// Book Course
app.post('/BookCourse',(req,res) => {
    db.collection('Courses').insert(req.body,(err,result) => {
        if(err) throw err;
        res.send('Course Booked')
    })
})


// View Course
app.get('/viewCourse',(req,res) => {
    let email = req.query.email;
    let query = {};
    if(email){
        query = {"email":email}
    }
    db.collection('Courses').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})
//update courses
app.put('/updateCourse/:id',(req,res) => {
    let oId = mongo.ObjectId(req.params.id);
    db.collection('Courses').updateOne(
        {_id:oId},
        {$set:{
            "status":req.body.status,
            "bank_name":req.body.bankName
            
        }},(err,result) => {
            if(err) throw err
            res.send(`Status Updated to ${req.body.status}`)
        }
    )
})

// Connection with db
MongoClient.connect(mongoLiveurl, (err,client) => {
    if(err) console.log(`Error while connecting`);
    db = client.db('scadb');
    app.listen(port,() => {
        console.log(`Server is running on port ${port}`)
    })
})