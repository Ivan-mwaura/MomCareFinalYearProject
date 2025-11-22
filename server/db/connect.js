const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
dialect: "postgres",
dialectModule: require("pg"),
dialectOptions: {
ssl: {
require: true,
rejectUnauthorized: false,
},
},
logging: false,
});

console.log("Database URL:", process.env.DATABASE_URL);

const connectDB = async () => {
try {
await sequelize.authenticate();
console.log("Connected to Supabase PostgreSQL successfully.");
const [results] = await sequelize.query(
"SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
);
console.log("Tables in public schema:", results.map((row) => row.table_name));
} catch (error) {
console.error("Database connection failed:", error);
process.exit(1);
}
};

module.exports = { sequelize, connectDB };