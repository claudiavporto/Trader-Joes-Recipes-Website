const express = require('express');
const router = express.Router();
const shoppingListController = require('../controllers/shoppingListController');
const auth = require('../middleware/authMiddleware');

router.get('/:userId', auth, shoppingListController.getShoppingList);
router.post('/:userId', auth, shoppingListController.addItem);
router.delete('/:userId/item', auth, shoppingListController.removeItem);
router.delete('/:userId/all', auth, shoppingListController.clearList);


module.exports = router;
