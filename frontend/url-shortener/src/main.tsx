import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const App = () => {
  const [shortUrl, setShortUrl] = React.useState<string>("");

  const onSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();

    const url = document.getElementById("url") as HTMLInputElement;

    const response = await fetch("/u?longUrl=" + url.value, {
      method: "POST",
    });

    const responseText = await response.text();

    console.log(responseText)

    setShortUrl(responseText);
  };

  return (
    <div>
      <h1>URL Shortener</h1>
      {shortUrl.length ? (
        <div>
          <a href={shortUrl}>{shortUrl}</a>
        </div>
      ) : (
        <div>
          <label htmlFor="url">URL to shorten:</label>
          <input id="url" type="text" />
          <button onClick={onSubmit}>Shorten</button>
        </div>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
