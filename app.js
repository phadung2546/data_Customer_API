const express = require('express')
const app = express()
const mysql = require('mysql2/promise')
const bodyparser = require('body-parser')
const cors = require('cors');

require('dotenv').config()

app.use(bodyparser.json())
app.use(cors());


let connectDB 

const connection = async () =>{
    try {
        connectDB = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        })
        console.log('Connected to DATABASE')
    } catch (error) {
        console.error('Error connecting to Database' , error.message)

        
    }
   
}


app.get('/api/customer' , async (req , res) => {
    try {
        const user = await connectDB.query('SELECT * FROM customer')
        res.json(user[0])

    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
        
    }
   
})

app.get('/api/customer/:id', async(req ,res) => {
    let id = req.params.id
    try {
        const user = await connectDB.query('SELECT * FROM customer WHERE Account_number = ?' , id)
        res.status(200).json(user[0][0])
    } catch (error) {
        console.error('Error GET customer' , error.message)
        res.status(500).json({error: 'ID Not found'})
    }
})

app.post('/api/customer/new' , async (req ,res)=>{
    try {
        let user = req.body
        const newUser = await connectDB.query('INSERT INTO customer SET ?', user)
        res.status(200).json({
            message : 'insert new customer OK ',
            user : newUser
        })
    } catch (error) {
        console.error('Error GET customer' , error.message)
        res.status(500).json({error: 'error'})
    }
})

app.get('/api/customerLoan', async(req,res)=>{
    
        const userLoan = await connectDB.query('SELECT * FROM personal_loan') 
        res.json(userLoan[0])
    
    
})

app.post('/api/customer/newloan' , async(req , res )=>{
    try {
        let personLoan = req.body
        const newUseLoan = await connectDB.query('INSERT INTO personal_loan SET ?', personLoan)
        res.status(200).json({
            message : 'insert new customer OK ',
            user : newUseLoan
        })
    } catch (error) {
        console.error('Error GET customer' , error.message)
        res.status(500).json({error: 'error'})
    }
})




const port =  3000
app.listen(port , async ()=>{
    await  connection()
    console.log(`server is running http://localhost:${port}`)
})

