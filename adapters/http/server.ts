import { createApp } from "./app";
import { PublicController } from "./controllers/PublicController";
import { ShortenedUrlController } from "./controllers/ShortenedUrlController";

export const start = () => {
  const app = createApp();

  new PublicController(app);
  new ShortenedUrlController(app);

  const server = app.listen(8080);

  console.log(`Server listening on port ${server.port}`);
};
