const initAdminProps = {
    userName: "admin@admin.com",
    password: "Ben0fmobbish",
};

class Config {
    private readonly _initialAdminProps: {password: string; userName: string};
    private readonly _mongoURL: string;
    private readonly _jwtTokenSecret: string;
    private readonly _port: number;
    private readonly _deploymentCountFilePath: string;

    constructor() {
        this._initialAdminProps = initAdminProps;
        this._mongoURL = process.env.MONGO_URL || "mongodb://localhost:27017/deployments-management";
        this._jwtTokenSecret = "b5euJuoUamppfU67psjT";
        this._port = process.env.PORT ? Number.parseInt(process.env.PORT) : 3000;
        this._deploymentCountFilePath = process.env.COUNT_TXT_FILE_PATH || "count.txt";
    }

    get initialAdminProps() {
        return this._initialAdminProps;
    }

    get mongoURL() {
        return this._mongoURL;
    }

    get jwtTokenSecret() {
        return this._jwtTokenSecret;
    }

    get port() {
        return this._port;
    }

    get deploymentCountFilePath() {
        return this._deploymentCountFilePath;
    }
}

export default new Config();
