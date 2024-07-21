require('dotenv').config();

module.exports = uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.k6ekwhj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;