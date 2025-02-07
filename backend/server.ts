import { Request, Response } from 'express';
// const app = express();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));

// app.use(cors({
//     origin: 'http://localhost:5173' // Solo permite solicitudes desde React (suponiendo que corre en el puerto 3000)
// }));

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/test-nodejs');

const User = sequelize.define('User', {
    username: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING }
});

sequelize.sync().then(() => {
    console.log('Base de datos y tabla creadas.');
});

// Routes
app.post('/api/users', async (req: Request, res: Response) => {
    try {
        const { username, email } = req.body;
        const user = new User({ username, email });
        await user.save();
        res.status(201).json({ success: true, data: user });
    } catch (error: any) {
        res.status(404).json({ success: false, message: error.message });
    }
});

// Init Server
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});