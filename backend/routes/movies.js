const express = require('express');
const pool = require('../db'); 

const router = express.Router();

// Rota para adicionar um filme à lista do usuário
router.post('/:id/add-movie', async (req, res) => {
    const userId = req.params.id;
    const { movieId, movieTitle } = req.body;

    try {
        await pool.query(
            "INSERT INTO user_movies (user_id, movie_id, movie_title) VALUES ($1, $2, $3)", 
            [userId, movieId, movieTitle]
        );
        res.status(201).json({ message: "Filme adicionado à lista!" });
    } catch (error) {
        console.error("Erro ao adicionar filme:", error);
        res.status(500).json({ error: "Erro ao adicionar filme" });
    }
});

module.exports = router;
