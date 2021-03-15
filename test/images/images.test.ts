import chai from "chai";
import chaiHttp from "chai-http";
import {testImage1, testImage2, testImage3} from "./data";
import {ImageModel} from "../../src/app/db/models/Image";
import {Express} from "express";
import App from "../../src/app";
import {testMongoUrl} from "../config/config";

chai.use(chaiHttp);

const should = chai.should();
const expect = chai.expect;

describe("Image", () => {
    describe("ImageController", () => {
        let express: Express;

        before(async () => {
            const app = new App();
            await app.init({mongoURL: testMongoUrl});
            express = app.express;
            await ImageModel.deleteMany();
        });

        it("should create images", async function () {
            const response2 = await chai.request(express).post("/image").send(testImage2);
            expect(response2).to.have.status(200);
            const response3 = await chai.request(express).post("/image").send(testImage3);
            expect(response3).to.have.status(200);
        });

        it("should get combination", async function () {
            const combinationResponse = await chai.request(express).get("/image/combination/2");
            expect(combinationResponse).to.have.status(200);
            combinationResponse.body.should.be.an("array").with.lengthOf(1);
        });
    });

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
});
