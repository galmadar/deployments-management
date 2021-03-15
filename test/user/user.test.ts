import {Express} from "express";
import chai from "chai";
import chaiHttp from "chai-http";
import {User, UserModel} from "../../src/app/db/models/User";
import {controllerUser, testUser1} from "./data";
import App from "../../src/app";
import {testMongoUrl} from "../config/config";

chai.use(chaiHttp);

const should = chai.should();
const expect = chai.expect;

describe("User", () => {
    describe("UserController", () => {
        let express: Express;

        before(async () => {
            const app = new App();
            await app.init({mongoURL: testMongoUrl});
            express = app.express;
        });

        it("should create user", async function () {
            const response = await chai.request(express).post("/user").send(controllerUser);
            expect(response).to.have.status(200);
        });
    });

    describe("UserService", () => {
        let createdUserId: string;

        before(async () => {
            await UserModel.deleteMany();
        });

        it("should not find a user", async () => {
            const users = await UserModel.find();
            users.should.be.lengthOf(0);
        });

        it("should create user", async () => {
            const createdUser = await UserModel.create(testUser1);
            createdUserId = createdUser._id;
            expect(createdUser).to.not.be.null;
            expect(createdUser).to.be.an("object", "User not created");
        });

        it("should find single user", async () => {
            const users = await UserModel.find();
            users.should.be.lengthOf(1);
        });

        it("should update a user", async () => {
            await UserModel.updateOne({_id: createdUserId}, {email: "new-email.com"} as User);
            const createdUser = await UserModel.findById(createdUserId);
            expect(createdUser).to.not.be.null;
            expect(createdUser).to.be.an("object", "User not created");
        });
    });
});
