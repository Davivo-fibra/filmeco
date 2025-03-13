require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || 'chave_secreta';

// Middlewares
app.use(cors());
app.use(bodyParser.json()); // Aplicado antes das rotas

// Rotas
const moviesRoutes = require('./routes/movies');
app.use('/users', moviesRoutes);

// Rota para verificar se o usuário já existe
app.post('/checkUser', async (req, res) => {
    const { username } = req.body;

    try {
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        res.json({ exists: result.rows.length > 0 });
    } catch (error) {
        console.error("Erro ao verificar usuário:", error);
        res.status(500).json({ error: "Erro ao verificar usuário" });
    }
});

// Rota de cadastro
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log("Tentando cadastrar:", username);
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Senha hash:", hashedPassword);

        await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, hashedPassword]);

        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        res.status(500).json({ error: "Erro ao cadastrar usuário", details: error.message });
    }
});

// Rota de login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ success: true, message: "Login successful", token });
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(500).json({ error: "Erro ao fazer login" });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
