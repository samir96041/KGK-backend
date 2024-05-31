const { Op } = require('sequelize');
const Item = require('../Model/item-model');

let getallitems = async (req, res) => {
  const { name, starting_price, current_price, end_time, min_price, max_price, page = 1, limit = 10 } = req.query;

  let where = {};
  
  if (name) {
    where.name = { [Op.like]: `%${name}%` }; // Partial match
  }

  if (min_price) {
    where.current_price = { ...where.current_price, [Op.gte]: parseFloat(min_price) };
  }

  if (max_price) {
    where.current_price = { ...where.current_price, [Op.lte]: parseFloat(max_price) };
  }

  if (end_time) {
    where.end_time = { [Op.lte]: new Date(end_time) };
  }

  const offset = (page - 1) * limit;
  
  try {
    const { count, rows } = await Item.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.send({
      items: rows,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      totalItems: count
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

let getitemid = async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  if (!item) {
    return res.status(404).send({ error: 'Item not found' });
  }
  res.send(item);
};

let postitem = async (req, res) => {
  const { name, description, starting_price, end_time } = req.body;

  // Check if a file was uploaded
  const imageUrl = req.file ? req.file.path : null;

  try {
    // Create the item with the uploaded image URL
    const item = await Item.create({ 
      name, 
      description, 
      starting_price, 
      current_price: starting_price, 
      image_url: imageUrl, // Save the image URL or file path
      end_time 
    });

    // Send the created item in the response
    res.status(201).send(item);
  } catch (err) {
    // Handle any errors
    res.status(400).send({ error: err.message });
  }
};

let putitem = async (req, res) => {
  const { name, description, starting_price, end_time } = req.body;
  const item = await Item.findByPk(req.params.id);
  if (!item) {
    return res.status(404).send({ error: 'Item not found' });
  }
  try {
    item.name = name;
    item.description = description;
    item.starting_price = starting_price;
    item.end_time = end_time;
    await item.save();
    res.send(item);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

let deleteitem = async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  if (!item) {
    return res.status(404).send({ error: 'Item not found' });
  }
  try {
    await item.destroy();
    res.send({ message: 'Item deleted' });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = { getallitems, getitemid, postitem, putitem, deleteitem };
