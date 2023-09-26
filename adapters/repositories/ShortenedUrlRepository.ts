import { Repository } from "./Repository";
import { ShortenedUrl } from "../../domain/entities/ShortenedUrl";
import { IShortenedUrlRepository } from "../ports/repositories/ShortenedUrlRepository";

const TABLE = "urls";

export class ShortenedUrlRepository
  extends Repository<ShortenedUrl>
  implements IShortenedUrlRepository
{
  constructor() {
    super();
    this.db
      .query(
        `CREATE TABLE IF NOT EXISTS urls(longUrl VARCHAR(50) NOT NULL, shortUrl VARCHAR(50) NOT NULL);`,
      )
      .run();
  }

  async getAllShortenedUrls() {
    const shortenedUrls = await this.select({
      table: TABLE,
      columns: ["longUrl", "shortUrl"],
    });
    return shortenedUrls;
  }

  async getShortenedUrl(shortUrl: string) {
    const shortenedUrl = await this.select({
      table: TABLE,
      columns: ["longUrl", "shortUrl"],
      where: "shortUrl = ?",
      values: {
        shortUrl,
      },
    });

    return shortenedUrl[0];
  }

  async insertShortenedUrl(shortenedUrl: ShortenedUrl) {
    const newShortenedUrl = await this.insert({
      table: TABLE,
      values: shortenedUrl,
    });

    return newShortenedUrl[0];
  }
}
