import { createPage, detailsPage, homePage, postCreate, editPage, postEdit, deleteArticle } from './controllers/catalog.js';
import { postRegister, postLogin, registerPage, loginPage, logoutUser } from './controllers/user.js';
import { getUserData } from './util.js';

const app = Sammy('#root', function (context) {

    this.use('Handlebars', 'hbs');

    this.userData = getUserData();

    this.get('/', homePage);
    this.get('/home', homePage);
    this.get('/create', createPage);
    this.get('/details/:id', detailsPage);
    this.get('/edit/:id', editPage);
    this.get('/delete/:id', deleteArticle);

    this.post('/create', (ctx) => { postCreate(ctx); });
    this.post('/edit/:id', (ctx) => { postEdit(ctx); });

    this.get('/register', registerPage);
    this.get('/login', loginPage);
    this.get('/logout', logoutUser);

    this.post('/register', (ctx) => { postRegister(ctx); });
    this.post('/login', (ctx) => { postLogin(ctx); });

});

app.run();