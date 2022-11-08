import { Request, Response } from "express";

const express = require('express');
const app = express()
const PORT = 5000
app.use(express.json())
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})