import { Request, Response } from "express";
import dotenv from 'dotenv';

dotenv.config();

const express = require('express');
const app = express();
const PORT: number = process.env.PORT || 5000;
app.use(express.json())
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})