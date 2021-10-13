const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")
const Swal = require('sweetalert2')
const links = []
const shortLinks = []
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static("public"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen( process.env.PORT || 3000 , function() {
  console.log("Server is running on port 3000")
})

app.get("/", function(req, res) {
  res.render("index", {
    links: links,
    shortLinks: shortLinks
  })
})

app.post("/", function(req, res) {
  var longurl = req.body.longurl
  var urlValidation = validURL(longurl)
  if (urlValidation === true) {
    const data = {
      destination: longurl
    }
    const jsonData = JSON.stringify(data)
    const url = "https://api.rebrandly.com/v1/links?apikey=0bea5cb4613944a2a7a89d0c0fc7bdd4"
    const headers = {
      "Content-Type": "application/json"
    }
    const options = {
      method: "POST",
      auth: "alimoamen:0bea5cb4613944a2a7a89d0c0fc7bdd4",
      headers: headers
    }
    const request = https.request(url, options, function(response) {
      response.on("data", function(data) {
        const shortUrl = "https://" + JSON.parse(data).shortUrl
        console.log(shortUrl)
        links.push(longurl)
        shortLinks.push(shortUrl)
        res.redirect("/")
      })
    })
    request.write(jsonData)
    request.end()
  } else {
    res.render("error", {
      links: links,
      shortLinks: shortLinks
    })
  }
})

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}


// 0bea5cb4613944a2a7a89d0c0fc7bdd4
