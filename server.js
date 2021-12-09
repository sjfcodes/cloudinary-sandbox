const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan')
const path = require('path');
const hbs = exphbs.create({});

const app = express();
const PORT = process.env.PORT || 3001;

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev')) // log traffic activity to console
app.use('/', require('./controller'))

app.listen(PORT, () => console.log('Server listening on: http://localhost:' + PORT));