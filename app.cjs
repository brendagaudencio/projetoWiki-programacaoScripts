const express = require('express')
const path = require('path')
// import express from "express";
// import path from "path";
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public/views', 'home.html'));
});

app.get('/login', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public/views', 'home.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log('Rodando o deregue');
});