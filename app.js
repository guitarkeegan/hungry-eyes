const express = require('express');
const app = express();
const path = require('path');
const HOME_PATH = path.join(__dirname, "views/index.html")


app.use(express.static(path.join(__dirname, 'public')));
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.sendFile(HOME_PATH, (err)=>console.error(err));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})