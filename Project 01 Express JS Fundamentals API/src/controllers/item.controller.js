// In-memory data store (mock database)
let items = [
  { id: 1, name: 'Sample Item 1', description: 'This is the first sample item' },
  { id: 2, name: 'Sample Item 2', description: 'This is the second sample item' }
];

// Helper to generate new ID
const getNextId = () => {
  const maxId = items.reduce((max, item) => (item.id > max ? item.id : max), 0);
  return maxId + 1;
};

// Controller functions (all stored in variables)

// GET /api/items
const getAllItems = (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/items/:id
const getItemById = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const item = items.find(i => i.id === id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Item with id ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/items
const createItem = (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    // Basic validation (already done by validator, but double-check)
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name and description are required'
      });
    }
    
    const newItem = {
      id: getNextId(),
      name,
      description
    };
    
    items.push(newItem);
    
    res.status(201).json({
      success: true,
      data: newItem
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/items/:id
const updateItem = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, description } = req.body;
    
    const itemIndex = items.findIndex(i => i.id === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Item with id ${id} not found`
      });
    }
    
    // Update only provided fields
    if (name !== undefined) items[itemIndex].name = name;
    if (description !== undefined) items[itemIndex].description = description;
    
    res.status(200).json({
      success: true,
      data: items[itemIndex]
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/items/:id
const deleteItem = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const itemIndex = items.findIndex(i => i.id === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Item with id ${id} not found`
      });
    }
    
    const deletedItem = items.splice(itemIndex, 1)[0];
    
    res.status(200).json({
      success: true,
      data: deletedItem,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};