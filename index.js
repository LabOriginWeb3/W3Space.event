const express = require("express");
const bodyParser = require("body-parser")

const app = express();
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.raw());

app.get("/", function(req, res) {
    res.send("W3events");
});

app.post("/events", function(req, res) {
    let num1 = Number(req.body.num1);
    let num2 = Number(req.body.num2);

    const result = num1 + num2 ;
    res.send("Addition - " + result);
});

app.listen(3000, function(){
    console.log("server is running on port 3000");
})
