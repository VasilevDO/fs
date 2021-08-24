const express = require ('express');
const config = require ('config');
const path=require('path');
const mongoose = require('mongoose');

const app=express();

app.use(express.json({extended:true}));

app.use('/api/auth',require('./routes/auth.routes'));
app.use('/api/link', require('./routes/link.routes'));
app.use('/api/image', require('./routes/image.routes'));
app.use('/api/todolist', require('./routes/todolist.routes'));
app.use('/api/blog', require('./routes/blogPost.routes'));
app.use('/api/weather', require('./routes/weather.routes'));
app.use('/api/currency', require('./routes/currency.routes'));
app.use('/api/feedback', require('./routes/feedback.routes'));
app.use('/t', require('./routes/redirect.routes'));


if (process.env.NODE_ENV==='production') {
    app.use('/',express.static(path.join(__dirname,'client','build')));
    app.get('*', (request,response)=>{
        response.sendFile(path.resolve(__dirname,'client','build','index.html'))
    });
}

const PORT=config.get('port') || 5000;

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'),{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useCreateIndex:true
        });
        app.listen(PORT,()=>console.log(`App has been started on port ${PORT}`)); 
    } catch(e) {
        console.log('Server error: ',e.message);
        process.exit(1);
    }
}

start();


