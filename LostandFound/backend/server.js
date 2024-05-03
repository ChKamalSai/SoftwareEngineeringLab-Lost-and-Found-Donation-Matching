const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mysql = require('mysql2/promise');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Akhil2004@',
    database: 'LostAndFound'
}).then((connection) => {
    console.log('Connected to MySQL database for Lost and Found');
    
const transporter = nodemailer.createTransport({
  // Configure your SMTP settings here
  service: 'Gmail',
  auth: {
    user: '21mcme10@uohyd.ac.in',
    pass: 'busc buvf rgnl bgya'
  }
});

// Route for sending emails
app.post('/send-email', async (req, res) => {
  const { from, to, subject, text } = req.body;

  try {
    const mailOptions = {
      from,
      to,
      subject,
      text
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Internal server error');
  }
});

// Your other routes...

    app.post('/lostAndFound/items', async (req, res) => {
        const { itemName, itemDescription, location, email, type, itemPhoto } = req.body;
        const itemImageBuffer = Buffer.from(itemPhoto.split(',')[1], 'base64');
        const insertQuery = `INSERT INTO items (item_name, item_description, item_location, email, type, item_image) VALUES (?, ?, ?, ?, ?, ?)`;
        await connection.query(insertQuery, [itemName, itemDescription, location, email, type, itemImageBuffer]);
        res.status(201).send({ message: 'Item uploaded successfully' });
    });

    app.get('/lostAndFound/items', async (req, res) => {
        const { email, view } = req.query;
        let query;
        if (view === 'own') {
            query = `SELECT * FROM items WHERE email = ? AND status='not found'`;
        } else if (view === 'others') {
            query = `SELECT * FROM items WHERE email <> ? AND status='not found'`;
        } else {
            query = `SELECT * FROM items WHERE status='not found'`;
        }
        const [rows] = await connection.query(query, [email]);
        res.status(200).json(rows);
    });

    app.get('/lostAndFound/contact/:email', async (req, res) => {
        const { email } = req.params;
        const query = `SELECT name, mobile, email FROM users WHERE email = ?`;
        const [user] = await connection.query(query, [email]);
        if (user.length > 0) {
            res.status(200).json(user[0]);
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    });

    app.post('/lostAndFound/found/:itemId', async (req, res) => {
        const { itemId } = req.params;
        const { finderEmail } = req.body;
      
        // Check for missing params
        if (!finderEmail) {
          return res.status(400).send({ message: "Finder email is required." });
        }
      
        try {
          const itemQuery = `SELECT * FROM items WHERE item_id = ?`;
          const [items] = await connection.query(itemQuery, [itemId]);
      
          if (items.length > 0) {
            const item = items[0];
      
            // Fetch finder details
            const finderQuery = `SELECT name, mobile, email FROM users WHERE email = ?`;
            const [finderDetails] = await connection.query(finderQuery, [finderEmail]);
      
            if (finderDetails.length > 0) {
              const finder = finderDetails[0];
      
              if (item.email !== finderEmail) {
                let message = '';
      
                if (item.type === 'anonymous') {
                  message = `Looks like the owner found their item "${item.item_name}". Owner's details: Name - ${finder.name}, Email - (${finder.mobile}, Phone - ${finder.email}`;
                } else {
                  message = `Your item "${item.item_name}" was found by ${finder.name} (${finder.mobile}, ${finder.email}).`;
                }
      
                const notificationQuery = `INSERT INTO notifications (owner_email, finder_email, item_id, message, read_status) VALUES (?, ?, ?, ?, false)`;
                await connection.query(notificationQuery, [item.email, finderEmail, itemId, message]);
      
                res.status(201).send({ message: 'Notification created for the owner.' });
              } else {
                res.status(400).send({ message: 'Finder cannot be the item owner.' });
              }
            } else {
              res.status(404).send({ message: 'Finder details not found.' });
            }
          } else {
            res.status(404).send({ message: 'Item not found' });
          }
        } catch (error) {
          console.error('Database error:', error);
          res.status(500).send({ message: 'Internal server error' });
        }
      });
      
  
    app.put('/lostAndFound/items/markFound/:itemId', async (req, res) => {
        const { itemId } = req.params;
        const updateQuery = `UPDATE items SET status = 'found' WHERE item_id = ?`;
        await connection.query(updateQuery, [itemId]);
        res.status(200).send({ message: 'Item marked as found.' });
    });

    app.get('/lostAndFound/notifications/:email', async (req, res) => {
        const { email } = req.params;
        const query = `SELECT * FROM notifications WHERE owner_email = ? AND read_status = false`;
        const [notifications] = await connection.query(query, [email]);
        res.status(200).json(notifications);
    });

    app.put('/lostAndFound/notifications/:notificationId', async (req, res) => {
        const { notificationId } = req.params;
        const updateQuery = `UPDATE notifications SET read_status = true WHERE id = ?`;
        await connection.query(updateQuery, [notificationId]);
        res.status(200).send({ message: 'Notification marked as read.' });
    });

    const registrationRoutesLostAndFound = require('./routes/registrationRoutesLostandFound');
    const loginRoutes = require('./routes/loginRoutes');
    app.use('/lostAndFound', registrationRoutesLostAndFound(connection));
    app.use('/lostAndFound', loginRoutes);

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Error connecting to MySQL:', error);
});