const express = require('express'); 
const app = express();
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');

app.use(cors());    
app.use(express.json());
app.use(bodyParser.json());






const port = process.env.PORT || 3673;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log("Connection to Database successful");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();