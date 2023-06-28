const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express()

app.use(express.static('Resources'));
app.use(bodyParser.urlencoded({extended:true}));

app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running at port : 3000")
});

app.get('/',function(req,res){
    res.sendFile(__dirname+"/signup.html");
});


app.post('/',function(req,res){
    var firstName = req.body.fname;
    var secondName = req.body.sname;
    var Email = req.body.mail;
    console.log(firstName,secondName,Email);


    var data = {
        members : [
            {
                email_address : Email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : secondName
                }
            }
                
        ]
    }

    var info = JSON.stringify(data);

    var url = "https://us12.api.mailchimp.com/3.0/lists/c8a7fd62ef";

    var option = {
        method : "POST",
        auth : "Baigan:0ba897a2bff5c0f10b174be80cdf0a1d-us12"
    } 

    const request = https.request(url , option ,function(response){
        response.on("data",function(data){
            console.log(JSON.parse(data));
            var statusbc = response.statusCode; 
            if (statusbc === 200){
                res.sendFile(__dirname+"/success.html");
            }
            else{
                res.sendFile(__dirname+"/failure.html");
            }
        });
    });

    request.write(info);
    request.end();
});

app.post('/failure',function(req,res){
    res.redirect('/');
});