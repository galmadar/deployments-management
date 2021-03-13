import chai from "chai";
import chaiHttp from "chai-http";
import {User, UserModel} from "../../src/db/models/User";
import {controllerUser, testUser1} from "./data";
import app from "../../src/app";

chai.use(chaiHttp);

const should = chai.should();
const expect = chai.expect;

describe("User", () => {
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

    describe("UserController", () => {
        it("should create user", async function () {
            const response = await chai.request(app).post("/user").send(controllerUser);
            expect(response).to.have.status(200);
        });
    });
});
