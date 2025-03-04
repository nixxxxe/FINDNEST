import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createItem,
  getItems,
  getItemDetails,
  claimItem,
  getTotalItems,
} from "../controller/items.controller.js";
const router = express.Router();

router.post("/report", verifyToken, createItem);
router.get("/getItems", verifyToken, getItems); // Now getItems should be recognized
router.get("/:id", verifyToken, getItemDetails);
router.post("/claim/:itemId", verifyToken, claimItem); // New route for claiming an item
router.get("/getTotalItems", verifyToken, getTotalItems);

export default router;
