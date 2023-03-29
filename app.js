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
    apiKey: "0027c6fa91ac418b6f2819c1f1dfc261-us",
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



// const response = await mailchimp.ping.get();

    // const response = await client.lists.getAllLists();

// const response = await client.lists.getList("4671d29ab7");

// const data = {
//     members: [
//         {
//             email_address: email,
//             status: "subscribed",
//             merge_fields: {
//                 FNAME: firstName,
//                 LNAME: lastName
//             }
//         }
//     ]
// };

// const jsonData = JSON.stringify(data);

// const url = "https://us14.api.mailchimp.com/3.0/lists/4671d29ab7";

// const options = {
//     method: "POST",
//     auth: "dele:0027c6fa91ac418b6f2819c1f1dfc261-us14"
// }

// const request = https.request(url , options , (response) => {
//     const status = response.statusCode;
//     if (status === 200) {
//         console.log("Subscription successful!");
//     } else {
//         console.log("You no wise!");
//     }
//     console.log("status: " + status);
//     response.on("data" , function(data) {
//         console.log(JSON.parse(data));
//     });

// });

// request.write(jsonData);
// request.end;