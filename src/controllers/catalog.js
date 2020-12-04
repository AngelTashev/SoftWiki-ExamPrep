import { getAll, createArticle, getById, editArticle, deleteArticleById } from "../data.js";
import { addPartials, getUserData, getUserId, mapCategories } from "../util.js";

export async function homePage() {

    if (this.app.userData === null) {
        return this.redirect('/register');
    }

    await addPartials(this);
    this.partials.article = await this.load('/src/templates/catalog/article.hbs');

    const context = mapCategories(await getAll());
    context.user = this.app.userData;

    this.partial('/src/templates/catalog/homePage.hbs', context);
}

export async function createPage() {

    if (this.app.userData === null) {
        return this.redirect('/register');
    }

    await addPartials(this);

    this.partial('/src/templates/catalog/createPage.hbs');
}

const categories = ['JavaScript', 'C#', 'Java', 'Python'];

export async function postCreate(ctx) {

    if (ctx.app.userData === null) {
        return ctx.redirect('/register');
    }

    try {
        const { title, category, content } = ctx.params;
        if (!title || !category || !content) {
            throw new Error('All fields are required!');
        }
        if (!categories.includes(category)) {
            throw new Error('Enter a valid category!');
        }
        await createArticle(title, category, content);
        ctx.redirect('/home');
    } catch (err) {
        alert(err.message);
    }
}

export async function detailsPage() {

    if (this.app.userData === null) {
        return this.redirect('/register');
    }

    await addPartials(this);

    const article = await getById(this.params.id);

    const context = {
        user: this.app.userData,
        isOwner: getUserId() === article._ownerId,
        article,
    }

    this.partial('/src/templates/catalog/detailsPage.hbs', context);
}

export async function editPage() {

    if (this.app.userData === null) {
        return this.redirect('/register');
    }

    await addPartials(this);

    const article = await getById(this.params.id);

    const context = {
        user: this.app.userData,
        article,
    }

    this.partial('/src/templates/catalog/editPage.hbs', context);
}

export async function postEdit(ctx) {

    if (ctx.app.userData === null) {
        return ctx.redirect('/register');
    }

    try {
        const { id, title, category, content } = ctx.params;
        if (!title || !category || !content) {
            throw new Error('All fields are required!');
        }
        if (!categories.includes(category)) {
            throw new Error('Enter a valid category!');
        }
        await editArticle(id, title, category, content);
        ctx.redirect('/home');
    } catch (err) {
        alert(err.message);
    }
}

export async function deleteArticle() {

    if (this.app.userData === null) {
        return this.redirect('/register');
    }

    const id = this.params.id;

    await deleteArticleById(id);

    this.redirect('/home');
}