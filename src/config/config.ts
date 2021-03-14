const initAdminProps = {
    userName: "admin@admin.com",
    password: "Ben0fmobbish",
};

class Config {
    private readonly _initialAdminProps: {password: string; userName: string};
    private readonly _mongoUrl: string;
    private readonly _jwtTokenSecret: string;
    private readonly _port: number;

    constructor() {
        this._initialAdminProps = initAdminProps;
        this._mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/deployments-management";
        this._jwtTokenSecret = "b5euJuoUamppfU67psjT";
        this._port = process.env.PORT ? Number.parseInt(process.env.PORT) : 3000;
    }

    get initialAdminProps() {
        return this._initialAdminProps;
    }

    get mongoUrl() {
        return this._mongoUrl;
    }

    get jwtTokenSecret() {
        return this._jwtTokenSecret;
    }

    get port() {
        return this._port;
    }
}

export default new Config();
