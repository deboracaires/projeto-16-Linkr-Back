import { Router } from "express";
import { hashtagRanking } from "../controllers/hashtagController.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";
import { hashtagFilter } from "../controllers/hashtagFilterController.js";

const hashtagRouter = Router();

hashtagRouter.get('/hashtagranking', validateTokenMiddleware, hashtagRanking);
hashtagRouter.get('/hashtag', hashtagFilter);


export default hashtagRouter;