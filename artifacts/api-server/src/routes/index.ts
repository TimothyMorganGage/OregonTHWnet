import { Router, type IRouter } from "express";
import healthRouter from "./health";
import membersRouter from "./members";
import forumRouter from "./forum";
import teamRouter from "./team";

const router: IRouter = Router();

router.use(healthRouter);
router.use(membersRouter);
router.use(forumRouter);
router.use(teamRouter);

export default router;
