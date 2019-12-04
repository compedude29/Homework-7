
const inquirer = require("inquirer");
const axios = require("axios");
const pdf = require('html-pdf');

let pdfopt = {   
    height: '3000',
    width: '1500',
};

function promptPerson() {
    return inquirer.prompt([
        {
            type: "input",
            name: "username",
            message: "Type GitHub Username"
        },
        {
            type: "input",
            name: "color",
            message: "Type your Favorite Color"
        }
    ]);
}


async function generateInfo(person){

    const profileURL = `https://api.github.com/users/${person}`;

    let response = await axios.get(profileURL);

    return response.data;
};

async function userStars(person){    
    const repoURL = `https://api.github.com/users/${person}/repos?per_page=1000`;
    const response = await axios.get(repoURL);
    let stars = 0;

 response.data.forEach(function(element)  {
        stars += element.stargazers_count;
    });
    return stars
}

function htmlCreate(userInfo, stars, color) {

    let location = userInfo.location.replace(/ /g, "+").replace(/,/g, "")

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <link href="https://fonts.googleapis.com/css?family=Calistoga&display=swap" rel="stylesheet">
        <style> h1, h2, h3 {text-align: center;} *{font-family: 'Times New Roman', Times, serif;}</style>
        <title>Profile Generator</title>
    </head>
    <body style="background: ${color}; height: 1800px; width: 1500px">
        <div class="container">
            <div class="row">
                <div class="col-sm-1"></div>
                <div class="col-sm-10 mt-5">
                    <div class="card mx-4">
                        <div class="card-header">
                                <img class="rounded mx-auto d-block m-4 border-dark" style="width: 300px; border-radius: 50%!important; box-shadow: 0px 0px 40px grey" src="${userInfo.avatar_url}" alt="Profile Image">
                        </div>
                        <h1 class="my-5">${userInfo.login}</h1>
                        <h3 class="mb-5">${userInfo.bio}</h3>
                        <ul class="list-inline text-center mb-5">
                            <li class="list-inline-item m-3"><a href="https://www.google.com/maps/place/${location}">${userInfo.location}</a></li>
                            <li class="list-inline-item m-3"><a href="${userInfo.html_url}">GitHub</a></li>
                            <li class="list-inline-item m-3"><a href="${userInfo.blog}">Blog</a></li> 
                        </ul>
                    </div>
                    <div class="row text-center">
                        <div class="card mx-auto my-3" style="width: 400px">
                            <div class="card-header text-center">
                                <H3 class="m-0">Public Repositories</H5>
                            </div>
                            <div class="card-body text-dark">
                                <h4 class="card-title text-center">${userInfo.public_repos}</h4>
                            </div>
                        </div>
                        <div class="card mx-auto my-3" style="width: 400px">
                            <div class="card-header text-center">
                                <H3 class="m-0">Followers</H5>
                            </div>
                            <div class="card-body text-dark">
                                <h4 class="card-title text-center">${userInfo.followers}</h4>
                            </div>
                        </div>
                        <div class="card mx-auto my-3" style="width: 400px">
                            <div class="card-header text-center">
                                <H3 class="m-0">GitHub Stars</H5>
                            </div>
                            <div class="card-body text-dark">
                                <h4 class="card-title text-center">${stars}</h4>
                            </div>
                        </div>
                        <div class="card mx-auto my-3" style="width: 400px">
                            <div class="card-header text-center">
                                <H3 class="m-0">Followers</H5>
                            </div>
                            <div class="card-body text-dark">
                                <h4 class="card-title text-center">${userInfo.following}</h4>
                            </div>
                        </div>
                    </div>
                <div class="col-sm-1"></div>
            </div>
            <div class="row">
            </div>
        </div>
    </body>
    </html>
    `;
}

async function begin(){

    const reply = await promptPerson();

    const userInfo = await generateInfo (reply.username); 

    const repoStars = await userStars (reply.username);

    const html = await htmlCreate(userInfo, repoStars, reply.color)

    pdf.create(html, pdfopt).toFile(`./${userInfo.login}.pdf`, function(err, res) {
        if (err) return console.log(err);
        console.log("PDF location: ");
        console.log(res);
        });
}


