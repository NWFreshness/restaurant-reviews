import express from "express";
import RestaurantsCtrl from "/.restaruants.controller.js"

const router = express.Router();

router.route('/').get(RestaurantsCtrl.apiGetRestaurants);

export default router;