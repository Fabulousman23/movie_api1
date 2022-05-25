const express = require("express"),
  bodyParser = require("body-parser");
  uuid = require("uuid");

const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect("mongodb://localhost:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("common")); //add morgan middlewar library

const res = require("express/lib/response");
const { mapValues, fill, filter, update } = require("lodash");
const { send } = require("express/lib/response");


//Middleware to...
app.use(express.static("public")); // serve static files
app.use(morgan("common")); // log requests to terminal
app.use(bodyParser.json()); // use body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// return JSON object whem at /movies
app.get("/movies", (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);  
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
    });
  });


app.get("/users", (req, res) => {
  Users.find()
  .then((users) => {
    res.status(201).json(users);  
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
    });
  });

// Get JSON movie info when looking for specific title
app.get("/movies/:Title", (req, res) => {
  Movies.findOne({Title: req.params.Title})
  .then((movies) => {
    res.status(201).json(movies);  
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
    });
  });

// allow users to register 
app.post ("/users", (req, res) => {
  Users.findOne({Username: req.body.Username})
  .then((user) => {
    if (user) {
    return res.status(400).send(req.body.Username + "already exists")
  } else {
    Users.create({
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday,
    })
    .then((user)=> {
      res.status(201).json(user);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
  }
})
});

// GET requests
app.get("/", (req, res) => {
  res.send("Welcome to the Top 10 Movies!!");
});

app.use("/documentation.html", express.static("public"));


// allow user to update their user info
app.put("/users/:Username", (req, res)=> {
  Users.findOneAndUpdate({
    Username: req.params.Username
  },
  {
    $set: {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    },
  },
  {new: true},
  (err, updateUser) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updateUser);
    }
  }
  );
});

// allow user to deregister

app.delete("/users/:Username", (req, res) => {
  Users.findOneAndRemove ({ Username: req.params.Username})
  .then((user) => {
    if (!user) { 
      res.status(400).send(req.params.Username + " was not found");
    } else {
      res.status(200).send(req.params.Username + " was deleted");
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});


// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});


// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
