import express from 'express';
var cors = require('cors')
import { config } from 'dotenv';
import { setupRoutes } from './routes';

config();
const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setupRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
