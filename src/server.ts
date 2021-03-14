import App from "./app";
import config from "./config/config";

const {port, mongoUrl} = config;
const app = new App();

app.config(mongoUrl)
    .then(() => {
        return app.listen(port);
    })
    .then(() => {
        console.log("App is running on port %d", port);
    });
