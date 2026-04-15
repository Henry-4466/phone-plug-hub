const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Phone Plug Hub Backend Running 🚀');
});

app.post('/order', (req, res) => {
    const order = req.body;

    console.log("📦 New Order Received:");
    console.log(order);

    res.json({
        success: true,
        message: "Order received successfully!"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});