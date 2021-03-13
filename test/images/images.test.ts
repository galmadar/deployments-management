import chai from "chai";
import chaiHttp from "chai-http";
import {testImage1, testImage2, testImage3} from "./data";
import app from "../../src/app";
import {ImageModel} from "../../src/db/models/Image";

chai.use(chaiHttp);

const should = chai.should();
const expect = chai.expect;

describe("Image", () => {
    describe("ImageService", () => {
        let createdImageId: string;

        before(async () => {
            await ImageModel.deleteMany();
        });

        it("should not find an image", async () => {
            const images = await ImageModel.find();
            images.should.be.lengthOf(0);
        });

        it("should create an image", async () => {
            const createdImage = await ImageModel.create(testImage1);
            createdImageId = createdImage._id;
            expect(createdImage).to.not.be.null;
            expect(createdImage).to.be.an("object", "Image not created");
        });

        it("should find a single image", async () => {
            const users = await ImageModel.find();
            users.should.be.lengthOf(1);
        });
    });

    describe("ImageController", () => {
        it("should create images", async function () {
            const response2 = await chai.request(app).post("/image").send(testImage2);
            expect(response2).to.have.status(200);
            const response3 = await chai.request(app).post("/image").send(testImage3);
            expect(response3).to.have.status(200);
        });

        it("should get combination", async function () {
            const combinationResponse = await chai.request(app).get("/image/combination/2");
            expect(combinationResponse).to.have.status(200);
            combinationResponse.body.should.be.an("array").with.lengthOf(3);
        });
    });
});
