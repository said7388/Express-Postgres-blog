import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import authRouter from './routers/auth.route';
import postRouter from './routers/post.route';

const app: Application = express();
const port = process.env.PORT || 4000;

// Use middleware 
dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Use Rate limiter for secure server
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: `You can only make 100 requests per minute`,
});
app.use(limiter);

// App Home Route
app.get('/', async (req: Request, res: Response) => {
  return res.send("Welcome to our Blog!");
});

// Other App routes
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);


// catch 404 and forward to error handler
app.use((req: Request, res: Response) => {
  return res.status(404).json({
    message: "No such route exists!"
  })
});

// error handler
app.use((err: Error, req: Request, res: Response) => {
  return res.status(500).json({
    message: "Something went wrong"
  })
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});