const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const port = 3001

const db = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '20m!S@l21Dm',
  database : 'm2coin_db',
});

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/api/getall', (req, res) => {
  const selectQuery = `SELECT id, created, title, short_description, long_description, location, price, stock, zipcode
  FROM publications`

  db.query(selectQuery, (error, result) => {
    res.send(result)
  })
})

app.post('/api/new', (req, res) => {
  const created =  req.body.created
  const title = req.body.title
  const short = req.body.short_description
  const long = req.body.long_description
  const location = req.body.location
  const price = req.body.price
  const stock = req.body.stock
  const zipcode = req.body.zipcode

  const insertQuery = `INSERT INTO publications
  (created, title, short_description, long_description, location, price, stock, zipcode)
  values (?, ?, ?, ?, ?, ?, ?, ?)`

  db.query(insertQuery, [created, title, short, long, location, price, stock, zipcode], (error, result) => {
    res.send(result)
  })
})

app.put('/api/update', (req, res) => {
  const id =  req.body.id
  const created =  req.body.created
  const title = req.body.title
  const short = req.body.short_description
  const long = req.body.long_description
  const location = req.body.location
  const price = req.body.price
  const stock = req.body.stock
  const zipcode = req.body.zipcode

  const updateQuery = `UPDATE publications
  SET created = ?, title = ?, short_description = ?, long_description = ?, location = ?, price = ?, stock = ?, zipcode = ?
  WHERE id = ?`

  db.query(updateQuery, [created, title, short, long, location, price, stock, zipcode, id], (error, result) => {
    res.send(result)
  })
})

app.delete('/api/delete/:id', (req, res) => {
  const id =  req.params.id
  
  const deleteQuery = `DELETE FROM publications WHERE id = ?`

  db.query(deleteQuery, id, (error, result) => {
    res.send(result)
  })
})

app.post('/api/new', (req, res) => {
  const created =  req.body.created
  const title = req.body.title
  const short = req.body.short_description
  const long = req.body.long_description
  const location = req.body.location
  const price = req.body.price
  const stock = req.body.stock
  const zipcode = req.body.zipcode

  const insertQuery = `INSERT INTO publications
  (created, title, short_description, long_description, location, price, stock, zipcode)
  values (?, ?, ?, ?, ?, ?, ?, ?)`

  db.query(insertQuery, [created, title, short, long, location, price, stock, zipcode], (error, result) => {
    res.send(result)
  })
})



app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
