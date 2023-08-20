const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
require('dotenv').config()

const app = express()

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));


app.get('/',function(req,res){
    res.sendFile(__dirname+"/views/signup.html");
});


app.post('/failure',function(req,res){
    res.redirect('/');
});


app.post('/',function(req,res){
    var firstName = req.body.fname;
    var secondName = req.body.sname;
    var Email = req.body.mail;
    console.log(firstName,secondName,Email);

    var data = {
        members : [{
                email_address : Email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : secondName
                }
            }]
    }

/***************************API-KEY********************************/

    var authentication = process.env.API_KEY;

/*****************************************************************/

    var info = JSON.stringify(data);
    var url = "https://us12.api.mailchimp.com/3.0/lists/c8a7fd62ef";
    var option = {method : "POST", auth : authentication} 

    const request = https.request(url , option ,function(response){
        response.on("data",function(data){
            console.log(JSON.parse(data));
            var status = response.statusCode; 
            if (status === 200){
                res.sendFile(__dirname+"/views/success.html");
            }else{
                res.sendFile(__dirname+"/views/failure.html");
            }
        });
    });

    request.write(info);
    request.end();
});


app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running at port : 3000")
});