import express from "express";
import {Router} from "express";
import BaseCrudService from "../services/BaseCrudService";

class BaseController {
    service: BaseCrudService;
    router: Router;

    constructor(service: BaseCrudService) {
        this.service = service;
        this.router = express.Router();
    }
}

export default BaseController;
