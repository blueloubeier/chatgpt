import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'
import mysql from 'mysql'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
})

app.post('/', async (req, res) => {

 
  try {
    const prompt = req.body.prompt;

  
    const chapGPT = async (prompt) => {
      const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      });
      res.status(200).send({
        bot: response["data"]["choices"][0]["message"]["content"]
      });


      const connection = mysql.createConnection({
        host: '154.17.10.6',
        user: 'telegram',
        password: 'Lbe87758258',
        database: 'telegram'
      });

      connection.connect();
      
      const newRecord = { question: prompt, answer: response["data"]["choices"][0]["message"]["content"] };

      connection.query('INSERT INTO chatgpt_qa SET ?', newRecord, function (error, results, fields) {
        if (error) throw error;
        console.log('Record added!');
      });
      connection.end();

      



      console.log(response["data"]["choices"][0]["message"]["content"]);
      };
    
    chapGPT(prompt)
   

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))