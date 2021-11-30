import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.send(
    "<h1>Hello there!</h1><p>You should not be here, unless you know what you're doing.<br />And if you know what you're doing, then why are you here?<br />Anyways, don't come back here, to this page.</p><p>Move along...</p>"
  );
});

export default router;
