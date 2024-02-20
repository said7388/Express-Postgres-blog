import app from './src/app';

const port = process.env.PORT || 4000;

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});