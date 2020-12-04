export function setUserData(data) {
    sessionStorage.setItem('auth', JSON.stringify(data));
}

export function getUserData() {
    let auth = sessionStorage.getItem('auth');
    if (auth !== null) {
        return JSON.parse(auth);
    }
    return null;
}

export function getUserId() {
    let auth = sessionStorage.getItem('auth');
    if (auth !== null) {
        return JSON.parse(auth).localId;
    }
    return null;
}

export function removeUserData() {
    sessionStorage.clear();
}

export function objectToArray(data) {
    if (data === null) {
        return [];
    }
    return Object.entries(data).map(([k, v]) => Object.assign({_id:k}, v));
}

export async function addPartials(ctx) {
    const partials = await Promise.all([
        ctx.load('/src/templates/common/header.hbs'),
        ctx.load('/src/templates/common/footer.hbs')
    ]);
    ctx.partials = {
        header: partials[0],
        footer: partials[1],
    };
}

const categoryMap = {
    'JavaScript': 'js',
    'C#': 'csharp',
    'Java': 'java',
    'Python': 'python',
}

export function mapCategories(data) {
    let categories = {
        js: [],
        csharp: [],
        java: [],
        python: [],
    };

    for (let article of data) {
        categories[categoryMap[article.category]].push(article);
    }

    // Sorting
    for (let key of Object.keys(categories)) {
        categories[key].sort((a, b) => a.title.localeCompare(b.title));
    }

    return categories;
}