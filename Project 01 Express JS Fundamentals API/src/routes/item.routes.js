import express from 'express';
import { body, param, validationResult } from 'express-validator';
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} from '../controllers/item.controller.js';
import { validateItem, validateId } from '../validators/item.validator.js';

const router = express.Router();

// Validation rules
const createValidation = [
  body('name').notEmpty().withMessage('Name is required').isString().trim(),
  body('description').notEmpty().withMessage('Description is required').isString().trim()
];

const updateValidation = [
  param('id').isInt().withMessage('ID must be an integer'),
  body('name').optional().isString().trim(),
  body('description').optional().isString().trim()
];

const idValidation = [
  param('id').isInt().withMessage('ID must be an integer')
];

// Routes
router.route('/')
  .get(getAllItems)
  .post(createValidation, validateItem, createItem);

router.route('/:id')
  .get(idValidation, validateId, getItemById)
  .put(updateValidation, validateItem, updateItem)
  .delete(idValidation, validateId, deleteItem);

export default router;