import App from "./app";
import config from "./config/config";

const port = config.port;
const app = new App();

app.config(config.mongoUrl)
    .then(() => {
        return app.listen(port);
    })
    .then(() => {
        console.log("App is running on port %d", port);
    });
