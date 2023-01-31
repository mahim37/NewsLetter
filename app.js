const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const https = require('https');
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req,res){

    res.sendFile(__dirname+"/public/signup.html");
});
app.post("/", function(req,res){
    let emailAddress = req.body.emailAddress;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;

    const data = {
        members:[
            {
                email_address:emailAddress,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    
    const list_id = "494fac3cc6";
    const apiKey = "myApi:aa9566cf65a267d950a8898ba761c6fa-us12";
    const mailchimpURL = "https://us12.api.mailchimp.com/3.0/lists/"+list_id;
    const options = {
        method:"POST",
        auth:apiKey,


    }
    const request = https.request(mailchimpURL,options);

    request.on('response', function(response){
        if(response.statusCode!=200){
            res.sendFile(__dirname+"/public/failure.html");
        }
        else{
            res.sendFile(__dirname+"/public/success.html");
        }
    })
    
    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req,res){
    res.redirect("/");
});


app.listen(process.env.PORT, function(){

    console.log(`Server started on port: ${port}`);
});

// 494fac3cc6
// aa9566cf65a267d950a8898ba761c6fa-us12