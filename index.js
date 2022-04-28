const express = require('express'),
      bodyParser = require('body-parser'),
      morgan = require('morgan');
const res = require('express/lib/response');
const { mapValues, fill, filter } = require('lodash');

      uuid = require('uuid');
    

const app = express();

app.use(bodyParser.json());
 
app.use(morgan('common')); //add morgan middlewar library


let users = [
  {
    id: 1,
    name: "Andrew",
    email: "smth@gmail.com",
    password: "potato&12",
    birthday: "01/23/2002",
    favoriteMovies: [],
  },
  {
    id: 2,
    name: "HelloWorld",
    email: "worldhello@gmail.com",
    password: "strongpassword234",
    birthday: "03/20/2001",
    favoriteMovies: [],
  }
];

let movies = [
  {
    title: "Harry Potter",
    year: '2001',
    genre: {
      name: "fantasy",
      description: "",
    },
    director: {
      name: "Chris Columbus",
      birth: "1958",
      death: "-",
      bio: "",
    },
    actors: {},
    imgURL: "",
  },
  {
    title: "Lord of the Rings",
    year: '2003',
    genre: {
      name: "Fantasy",
      description: "",
    },
    director: {
      name: "Peter Jackson",
      birth: "1961",
      death: "-",
      bio: "",
    },
    actors: {},
    imgURL: "",
  },
  {
    title: "Inception",
    year: '2010',
    genre: {
      name: "Science-Fiction",
      description: "",
    },
    director: {
      name: "Cristoper Nolan",
      birth: "1970",
      death: "-",
      bio: "",
    },
    actors: {},
    imgURL: "",
  },
  {
    title: "The Great Gatsby",
    year: "2013",
    genre: {
      name: "Drama",
      description: "",
    },
    director: {
      name: "Baz Luhrmann",
      birth: "1962",
      death: "-",
      bio: "",
    },
    actors: {},
    imgURL: "",
  }
];

// CREATE

app.post('/users', (req,res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
   res.status(400).send('users need names!')   
  }
})



// UPDATE 

// add favorite movie
app.post('/users/:id/:movieTitle', (req, res) => {
   const {id, movieTitle} = req.params;

   let user = users.find(user => user.id = id);
   
   if (user) {
     user.favoriteMovies.push(movieTitle);
     res.status(200).send(`${movieTitle} was added to favorites!`);
   } else {
     req.status(400).send('no such user')
   }
})


// DELETE

app.delete('/users/:id/:movieTitle', (req, res) => {
   const {id, movieTitle} = req.params;

   let user = users.find(user => user.id = id);
   
   if (user) {
     user.favoriteMovies.filter(title => title !== movieTitle);
     res.status(200).send(`${movieTitle} has been removed from favorites!`);
   } else {
     req.status(400).send('no such thing')
   }
})


// DELETE users 

app.delete('/users/:id/', (req, res) => {
   const {id} = req.params;

   let user = users.find(user => user.id = id);

   if (user) {
     users = users.filter(user => user.id != id);
     res.status(200).send(`user ${id} has been removed!`);
   } else {
     req.status(400).send('no such user')
   }
})




//update user (PUT)
app.put('/users/:id', (req,res) => {
  const {id} = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id);
  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such users!')
  }
  
})




// READ


// welcome

app.get('/', (req, res) => {
  res.status(200).send('Welcome to my movie club!!');
})

// all movies 
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
})

// get movie by title

app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find(movie => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('...no such title!')
  }
})

// get info about genre
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find(movie => movie.genre.name === genreName).genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('...no such genre!')
  }
})

// get info by Director Name

app.get('/movies/director/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(movie => movie.director.name === directorName).director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('...no such director!')
  }
})

// error handler 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
