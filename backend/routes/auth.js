// src/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs'); // Para hash da senha
const jwt = require('jsonwebtoken'); // Para gerar tokens JWT
const pool = require('../db'); // Supondo que você tenha configurado o banco de dados

const router = express.Router();
console.log('Banco de dados:', process.env.DATABASE_URL);


// Rota para registrar um novo usuário
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Usuário e senha são obrigatórios!' });
    }

    try {
        // Verificar se o usuário já existe
        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Usuário já existe!' });
        }

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Inserir o novo usuário no banco
        const newUser = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            [username, hashedPassword]
        );

        res.status(201).json({ message: 'Usuário registrado com sucesso!', user: newUser.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor ao registrar o usuário!' });
    }
});

// Rota para login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Usuário e senha são obrigatórios!' });
    }

    try {
        // Verificar se o usuário existe
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Usuário ou senha incorretos!' });
        }

        // Comparar a senha fornecida com a senha armazenada
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Usuário ou senha incorretos!' });
        }

        // Gerar o token JWT
        const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login bem-sucedido!', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor ao tentar fazer login!' });
    }
});

module.exports = router;