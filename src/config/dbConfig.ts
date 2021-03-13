const envMongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/deployments";

class DbConfig {
    private mongoUrl: string;

    constructor(connectionString: string) {
        this.setMongoUrl(connectionString);
    }

    getMongoUrl() {
        return this.mongoUrl;
    }

    setMongoUrl(connectionString: string) {
        this.mongoUrl = connectionString;
    }
}

export default new DbConfig(envMongoUrl);
