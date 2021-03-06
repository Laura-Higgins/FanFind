var Twitter = require('twitter');
if (process.env.NODE_ENV === "production"){
 var twitterCred = JSON.parse(process.env.Twitter_API_Key)
 var youTubeKey = JSON.parse(process.env.Youtube_API_Key)
}
else {
  var twitterCred = require('./twitter.json')
  var youTubeKey = require('./youtube.json')
}

var twitter = new Twitter(twitterCred);

var youtube = require('youtube-search')

var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var request = require('request')

app.use(bodyParser.json())

app.get('/tweets', function(req, res, next){
  var params = req.query
  twitter.get('search/tweets', params, function(error, content, response) {
    var tweets = content.statuses
    if(error) {
      console.log(error)
    }
    if (!error) {
      var tweetResults = tweets.map(function(tweet) {
        return { name: tweet.user.screen_name, text: tweet.text, created_at: tweet.created_at }
      })
        res.send(tweetResults)
    }
  })
})

app.get('/wiki', function(req, res, next) {
  var params = req.query.search
  request("https://en.wikipedia.org/w/api.php?action=opensearch&search=" + params + "&limit=15&format=json", function(error, response, content){
    if(error) {
      console.log(error)
    } else {
      res.send(content)
    }
  })
})

app.get('/videos', function (req, res, next){
  var query = req.query.q
  youtube(query, youTubeKey, function(error, content, response){
    if(error) {
      console.log(error)
    }
    if(!error) {
      res.send(content)
    }
  })
})

app.use(express.static('public'))
var port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('listening port 3000!')
})
