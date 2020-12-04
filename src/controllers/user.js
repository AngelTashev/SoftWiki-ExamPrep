import { register, login, logout } from "../data.js";
import { addPartials, getUserData, removeUserData } from "../util.js";

export async function registerPage() {
    await addPartials(this);
    this.partial('/src/templates/user/registerPage.hbs');
}

export async function postRegister(ctx) {
    try {
        const { email, password, rePass } = ctx.params;
        if (!email || !password || !rePass) {
            throw new Error('All fields are required!');
        } else if (password !== rePass) {
            throw new Error('Passwords don\'t match!');
        }

        const result = await register(email, password);
        ctx.app.userData = result;
        ctx.redirect('/home');
    } catch (err) {
        alert(err.message);
        console.clear();
        removeUserData();
    }
}

export async function loginPage() {
    await addPartials(this);
    this.partial('/src/templates/user/loginPage.hbs');
}

export async function postLogin(ctx) {
    try {
        const { email, password } = ctx.params;
        if (!email || !password) {
            throw new Error('All fields are required!');
        }

        const result = await login(email, password);
        ctx.app.userData = result;
        ctx.redirect('/home');
    } catch (err) {
        alert(err.message);
        console.clear();
        removeUserData();
    }
}

export async function logoutUser() {
    await logout();
    this.app.userData = null;
    this.redirect('/login');
}