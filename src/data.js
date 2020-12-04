import { setUserData, getUserData, removeUserData, objectToArray, getUserId } from "./util.js";

const apiKey = 'AIzaSyD5VCmnSMbWsc9g_SGHWP_1NGW9SnLDpzE';
const databaseUrl = 'https://soft-wiki-ea33a.firebaseio.com/';

const endpoints = {
    LOGIN: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=',
    REGISTER: 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=',
    ARTICLES: 'articles',
    ARTICLE_BY_ID: 'articles/',
}

function host(url) {
    let result = `${databaseUrl}${url}.json`;
    const auth = getUserData();
    if (auth !== null) {
        result += `?auth=${auth.idToken}`;
    }
    return result;
}

async function request(url, method, body) {
    let options = {
        method,
    };

    if (body) {
        Object.assign(options, {
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(body),
        });
    }

    let response = await fetch(url, options);

    let data = await response.json();

    if (data && data.hasOwnProperty('error')) {
        let message = data.error.message;
        if (message === 'EMAIL_NOT_FOUND' || message === 'INVALID_PASSWORD') {
            message = 'Invalid email or password!';
        }
        throw new Error(message);
    }
    return data;
}

async function get(url) {
    return request(url, 'GET');
}

async function post(url, body) {
    return request(url, 'POST', body);
}

async function patch(url, body) {
    return request(url, 'PATCH', body);
}

async function del(url) {
    return request(url, 'DELETE');
}

export async function getAll() {
    const entities = await get(host(endpoints.ARTICLES));
    return objectToArray(entities);
}

export async function getById(id) {
    const entity = await get(host(endpoints.ARTICLE_BY_ID + id));
    entity._id = id;
    return entity;
}

export async function login(email, password) {
    let data = await post(endpoints.LOGIN + apiKey, {
        email,
        password,
        returnSecureToken: true,
    });

    setUserData(data);

    return data;
}

export async function register(email, password) {
    let data = await post(endpoints.REGISTER + apiKey, {
        email,
        password,
        returnSecureToken: true,
    });

    setUserData(data);

    return data;
}

export async function logout() {
    return sessionStorage.clear();
}

export async function createArticle(title, category, content) {
    const article = { title, category, content };
    article._ownerId = getUserId();
    return post(host(endpoints.ARTICLES), article);
}

export async function editArticle(id, title, category, content) {
    return patch(host(endpoints.ARTICLE_BY_ID + id), { title, category, content });
}

export async function deleteArticleById(id) {
    return del(host(endpoints.ARTICLE_BY_ID + id));
}