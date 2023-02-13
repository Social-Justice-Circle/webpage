const express = require("express");
const Router = express.Router();
const connection = require('../../model/db');
const info = require("../../config/info.json")
const { Configuration, OpenAIApi } = require("openai");

Router.get('/article', (req, res) => {
  /* if(req.session.loggedin){
    res.render("admin")
  } else {
    res.render("login")
  }
  console.log(req.session.loggedin) */
  res.render('admin/manage/article');
})

Router.get('/category', (req, res) => {
  /* if(req.session.loggedin){
    res.render("admin")
  } else {
    res.render("login")
  }
  console.log(req.session.loggedin) */
  connection.query('SELECT * FROM category', (err, rows) => {
    var categories = '';
    let index = 0;
    console.log(rows)
    while(typeof rows[index] != 'undefined'){
      categories = categories.concat(" ",rows[index].name);
      index += 1;
    }

    res.render('admin/manage/category', {
      categories: rows,
    });
  })
})

Router.post('/category/create', (req, res) => {
  /* if(req.session.loggedin){
    res.render("admin")
  } else {
    res.render("login")
  }
  console.log(req.session.loggedin) */
  /* prompt should generate exept lang stored in database */
  connection.query('SELECT * FROM category', (err, rows) => {
    var categories = '';
    let index = 0;
    while(typeof rows[index] != 'undefined') {
      categories = categories.concat(" ", rows[index].name)
      index += 1;
      console.log(categories)
    };

    (async () => {
      const configuration = new Configuration({
        apiKey: info.OpenAiApi,
      });
      const openai = new OpenAIApi(configuration);
      
      try {
        let new_category = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `think about what one concept should be thaought in programming and devops blog(only say the name of the language without explanation and exept ${categories})`,
          max_tokens: 15,
          temperature: 0,
        });

        new_category = new_category.data.choices[0].text.replace(/[^a-z A-Z 0-9]/gi, '');

        /* planning blog post part */
        let new_topics = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `try to plan many blog posts as possible for ${new_category} (only titles and list-up the contents) rule: add ;% at the start of the title`,
          max_tokens: 1000,
          temperature: 0,
        });

        new_topics = new_topics.data.choices[0].text;
        let new_topics_arr = new_topics.split(';%');
        /* remove blank */
        new_topics_arr.splice(0, 1);

        connection.query('INSERT INTO category SET ?', {name: new_category})
        console.log(new_category)
        connection.query(`CREATE TABLE ${new_category} (post_id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(500), contents VARCHAR(20000), status varchar(30) default 'no')`)
        let index = 0;
        while(typeof new_topics_arr[index] != 'undefined'){
          const post_info = {
            title: new_topics_arr[index].split(';')[0],
            contents: new_topics_arr[index].split(';')[1]
          }
          connection.query(`INSERT INTO ${new_category} SET ?`, post_info);
          index += 1;
        }
        console.log(new_category, new_topics, new_topics_arr[0]);
      } catch (error) {
        if (error.response) {
          console.log(error.response.status);
          console.log(error.response.data);
        } else {
          console.log(error.message);
        }
      }
    })();
  });


})


module.exports = Router