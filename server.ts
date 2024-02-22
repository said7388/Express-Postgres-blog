import morgan from 'morgan';
import app from './src/app';

const port = process.env.PORT || 4000;

// Start the server
app.listen(port, () => {
  app.use(morgan("dev")); // API request logger

  console.log(`Server listening on port ${port}`);
});