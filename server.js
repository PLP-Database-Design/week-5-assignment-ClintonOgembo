// import our dependancies
const express = require("express")
const app = express()
const mysql = require('mysql2');
const dotenv = require('dotenv') //bcoz our variables are in .env

//cors and ejs installation
//cors is used to controll who can access your db using URL
//ejs is used for display to be more appealing

// in order to use our variables, we configure our .env
dotenv.config(); 


/* basic endpoint to displaye hello world on the browser.
app.get('', (req, res) => {
    res.send("Hello world, Clinton is writing some code, i was in spain yesterday and Today am here")
})
*/

// create a connection object
const db = mysql.createConnection({
    host: process.env.DB_HOST,    
    user: process.env.DB_USERNAME,    
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME 
})

// TEST the connection
db.connect((err) => {
    // if the connection isn't successiful
    if(err) {
        return console.log('Error connecting to the database: ',err)
    }

    //connection is successiful
    console.log('Successifully connected to mysql: ', db.threadId)
})

//not important on the assignment.
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')


//Question 1 goes here

//GET-retrieve 
app.get('/patients',(req, res) => {
    const getPatients = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients'
    db.query(getPatients,(err, data) => {
        if(err) {
            return res.status(400).send('Failed to get Patients')
        }
        //if no error
        res.status(200).render('data',{ data, type : 'patients' })
    })
})

//Question 2 goes here

app.get('/providers',(req, res) => {
    const getProviders = 'SELECT first_name, last_name, provider_specialty FROM providers'
    db.query(getProviders,(err, data) => {
        if(err) {
            return res.status(400).send('Failed to get provider')
        }
        //if no error
        res.status(200).render('data',{ data, type : 'providers' })
    })
})

//Question 3 goes here

// Filter patients by first name
app.get('/patients/filter', (req, res) => {
    // Get the first_name from the query parameter
    const firstName = req.query.first_name;

    // SQL query to get patients by first name
    const filterPatients = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';

    // Execute the query, passing the first name as a parameter
    db.query(filterPatients, [firstName], (err, data) => {
        if (err) {
            return res.status(400).send('Failed to filter patients by first name');
        }
        if (data.length === 0) {
            return res.status(404).send('No patients found with that first name');
        }

        // Render the filtered data
        res.status(200).render('data', { data, type: 'patients' });
    });
});


//  Question 4 goeas here

// Filter providers by their specialty
app.get('/providers/filter', (req, res) => {
    // Get the provider_specialty from the query parameter
    const specialty = req.query.specialty;

    // SQL query to get providers by their specialty
    const filterProviders = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';

    // Execute the query, passing the specialty as a parameter
    db.query(filterProviders, [specialty], (err, data) => {
        if (err) {
            return res.status(400).send('Failed to filter providers by specialty');
        }
        if (data.length === 0) {
            return res.status(404).send('No providers found with that specialty');
        }

        // Render the filtered data
        res.status(200).render('data', { data, type: 'providers' });
    });
});


// start and listen to the server
app.listen(3300, () => {
    console.log( 'server is running on port 3300...' )
})


//POST-insert
//PUT-update
//DELETE-remove