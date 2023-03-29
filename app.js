const express = require('express');

const bodyParser = require("body-parser");

const app = express();

const https = require("https");

const client = require("@mailchimp/mailchimp_marketing");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get( "/" , function(req , res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/" , function(req , res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.eMail;
    console.log(firstName , lastName , email);

    const mailchimp = require("@mailchimp/mailchimp_marketing");

    mailchimp.setConfig({
    apiKey: "e17a080ca02459323bb06157c516b3eb-us14",
    server: "us14",
    });

    async function run() {
        try {
            const response = await client.lists.batchListMembers("4671d29ab7", {
                members: [
                    {
                        email_address: email,
                        status: "subscribed",
                        merge_fields: {
                            FNAME: firstName,
                            LNAME: lastName
                        }
                    }
                ],
            });
            console.log(response);
            res.sendFile(__dirname + "/sucess.html");
        } catch (err) {
            console.log(err);
            res.sendFile(__dirname + "/failure.html");
        }
    }
    run();    
});

app.post("/failure" , ( req , res ) => {
    res.redirect("/");
});

app.listen(process.env.PORT || 4000, function() {
    console.log("server is up and running fast!");
});
