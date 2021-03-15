import App from "./app";
import config from "./config/config";

const {port, mongoURL} = config;
const app = new App();

app.init({mongoURL})
    .then(() => {
        return app.listen(port);
    })
    .then(() => {
        console.log("App is running on port %d", port);
    });
