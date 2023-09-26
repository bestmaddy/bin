const mysql = require('mysql');
const cors = require('cors');
const express = require('express');
const options = {
    cors: { origins: ["http://localhost:4200"] },
    methods: ["GET", "POST"],
    credentials: false
};
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(cors(options));
const port_no = process.env.PORT || 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: 'root',
    database: 'task_management'
});

connection.connect(function (error) {
    if (error) {
        console.log("Error Connecting to DB");
    } else {
        console.log("successfully Connected to DB");
    }
});



app.get('/getTask', (req, res) => {
    const sql = 'SELECT * FROM task_list;'
    connection.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error in gating data' });
            console.error('Error in gating data :', err);
        } else {
            res.json({ success: true, message: 'Data send successfully', data: result });
            console.log('Data send successfully');
        }
    });
});

app.post('/SaveTask', (req, res) => {
    console.log("save task:", req)
    const { id, title, description, duedate, status } = req.body;
    const sql = 'INSERT INTO task_list (id, title, description, duedate, status) VALUES (?, ?, ?, ?, ?)';
    const values = [id, title, description, duedate, status];

    connection.query(sql, values, (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error in data uploading' });
            console.error('Error in data uploading :', err);
        } else {
            res.json({ success: true, message: 'Data uploaded successfully', data: result });
            console.log('Data uploaded successfully');
        }
    });
});

app.post('/updateTask/:id', (req, res) => {
    console.log("update data: ", req)
    const sql = `UPDATE task_list SET status = '${req.body.status}' WHERE id = ${req.params.id}`;
    connection.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error in updating data' });
            console.error('Error in updating data :', err);
        } else {
            res.json({ success: true, message: 'Data updating successfully', data: result });
            console.log('Data updating successfully');
        }
    });
});

app.post('/deleteTask/:id', (req, res) => {
    console.log("delete req", req)
    const sql = `DELETE FROM task_list WHERE id = ${req.params.id}`;

    connection.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error in deleting data' });
            console.error('Error in deleting data :', err);
        } else {
            res.json({ success: true, message: 'Data delete successfully', data: result });
            console.log('Data delete successfully');
        }
    });
});




app.listen(port_no, () => console.log('app is listening on port.', port_no));
