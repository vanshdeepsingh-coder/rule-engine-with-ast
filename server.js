const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const ruleRoutes = require('./routes/router');

const app = express();
const PORT = 3000 || process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
                
mongoose.connect('mongodb+srv://vanshdeepsingh:Vanshdeep24907@cluster0.jzjcoqk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Error connecting to MongoDB", err);
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './views/index.html'));
});

app.use('/api/rules', ruleRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
