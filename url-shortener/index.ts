import { Database, SQLQueryBindings } from "bun:sqlite";

import { App } from "../core/app";

enum RequestError {
    NO_URL_PROVIDED = "NO_URL_PROVIDED",
    
}

type ShortenedUrl = {
    longUrl: string;
    shortUrl: string;
}

const db = new Database("db.sqlite");

db.query(`CREATE TABLE IF NOT EXISTS urls(longUrl VARCHAR(50) NOT NULL, shortUrl VARCHAR(50) NOT NULL);`).run();

const shortenUrl = async (request: Request) => {
    const url = new URL(request.url)
    const longUrl = url.searchParams.get("longUrl")
    
    if (!longUrl) {
        return new Response(RequestError.NO_URL_PROVIDED, { status: 400 })
    }

    const dbUrls = db.prepare<ShortenedUrl, SQLQueryBindings[]>(`SELECT * FROM urls;`).all();
    
    let shortUrl = crypto.randomUUID().substring(2, 5);
    while (dbUrls.find((url) => url.shortUrl === shortUrl)) {
        shortUrl = crypto.randomUUID().substring(2, 5);
    }

    console.log(`[${new Date().toISOString()}]: ${longUrl.toString()} -> ${shortUrl}`);

    db.prepare<string, SQLQueryBindings[]>(`INSERT INTO urls VALUES (?, ?);`).run(longUrl, shortUrl);
    
    const fullUrl = `${url.protocol}//${url.host}/u/${shortUrl}`;

    return new Response(fullUrl, { status: 200 })
}

const redirect = async (request: Request) => {
    const url = new URL(request.url);
    const shortUrl = url.pathname.substring(3);

    const dbUrl = await db.prepare<ShortenedUrl, SQLQueryBindings[]>(`SELECT * FROM urls WHERE shortUrl = ?;`).get(shortUrl);

    if (!dbUrl) {
        return new Response("Not found", { status: 404 });
    }

    return Response.redirect(dbUrl.longUrl, 301);
}

export const initUrlShortenerPlugIn = (app: App) => {
    app.router.get("/u/*", redirect);
    app.router.post("/u", shortenUrl);
    console.log("Url shortener plugin initialized");
}