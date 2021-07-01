//importar el modulo server
const connection = require("../../config/db");
const app = require("../../config/server");
const bcryptjs = require('bcryptjs');
const moment = require('moment'); // Importing the Moment.js module

module.exports = app => {
    app.get('/', (req,res) => {
        res.render('../views/login.ejs');
    })

    app.get('/dashboard', (req,res) => {
        if (req.session.loggedin) {
            connection.query("SELECT * FROM usuarios", (err, result) => {
                if(err){
                    res.send(err);
                } else {
                    res.render("../views/dashboard.ejs", {
                        usuarios: result,
                        login: true,
                        name: req.session.name
                    });
                }
            })
        } else {
            res.render('../views/login.ejs');
        }
        
    })

    app.get("/delete/:id", (req,res) => {
        const id = req.params.id;
        connection.query("DELETE FROM usuarios WHERE id = ?", [id], (err, result) => {
            if(err){
                res.send(err);
            } else {
                connection.query("SELECT * FROM usuarios", (err, result) => {
                    if(err){
                        res.send(err);
                    } else {
                        res.redirect("/dashboard");
                        /* res.render("../views/dashboard.ejs", {
                            usuarios: result,
                            login: true,
                            name: req.session.name
                        }); */
                    }
                })
            }
        })
    })

    app.post("/edit/:id", (req,res) => {
        const id = req.params.id;
        const {nameComplete} = req.body
        console.log(req.body);
        connection.query("UPDATE usuarios SET nameComplete = ? WHERE id = ?", [nameComplete, id], (err, result) => {
            if(err){
                res.send(err);
            } else {
                res.redirect("/dashboard");
            }
        })
    })

    app.get('/login', (req,res) => {
        res.render('../views/login.ejs');
    })
    app.get('/register', (req,res) => {
        res.render('../views/login.ejs');
    })
    app.get('/auth', (req,res) => {
        res.render('../views/login.ejs');
    })
    
    app.get('/logout', (req, res)=>{
        req.session.destroy(() =>{
            res.redirect('/')
        })
    })

    //Solicitudes post formulario de registro
    app.post('/register', async(req,res)=>{
        const{nameComplete,email, user, password, restricted} = req.body;
        console.log(req.body);
        if (restricted === "NULL") {
            restricted = 0
        }
        let passwordBcrypt = await bcryptjs.hash(password,8);
        
        connection.query("INSERT INTO usuarios SET?",{
            nameComplete:nameComplete,
            email:email,
            user:user,
            rol: "user",
            password:passwordBcrypt, 
            date_create: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            restricted: restricted,
            date_update: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        }, async(error,results)=>{
            if(error){
                console.log(error);
            }else{
                connection.query("SELECT * FROM usuarios", (err, result) => {
                    if(err){
                        res.send(err);
                    } else {
                        res.render('../views/dashboard.ejs', {
                            alert: true,
                            alertTitle: "Registro",
                            alertMessage: "Registro exitoso",
                            alertIcon: "success",
                            showConfirmButton: false,
                            timer: 1500,
                            ruta: '',
                            usuarios: result,
                            login: true,
                            name: req.session.name,
                        })
                    }
                })
            }
        })
    })

    app.post('/auth', async(req,res)=> {
        const{user, password} = req.body;
        if (user && password) {
            connection.query("SELECT * FROM usuarios WHERE user = ?", [user], async(error, result)=>{
                console.log(result[0].password)
                if(result.length === 0 || !(await bcryptjs.compare(password, result[0].password)) || result[0].rol === 'user'){
                    res.render('../views/login.ejs', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o contraseña incorrectas",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer: 1500,
                        ruta: 'login'
                    })
                }else{
                    req.session.loggedin = true
                    req.session.name = result[0].nameComplete
                    connection.query("SELECT * FROM usuarios", (err, result) => {
                        if(err){
                            res.send(err);
                        } else {
                            res.render('../views/dashboard.ejs', {
                                alert: true,
                                alertTitle: "Conexion existosa",
                                alertMessage: "Inicio de sesion correcto",
                                alertIcon: "success",
                                showConfirmButton: false,
                                timer: false,
                                ruta: '',
                                usuarios: result,
                                login: true,
                                name: req.session.name
                            })
                        }
                    })
                    
                }
            })
        }
    })

}

