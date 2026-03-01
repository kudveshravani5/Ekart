const router = require('express').Router();
const Product = require('../models/Product');

router.get('/search', async (req, res) => {
  const { q } = req.query;

  try {
    // 1. Find the primary products
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    });

    // 2. Simple "AI" Suggestion Logic: 
    // Get related categories from the first search result
    let suggestions = [];
    if (products.length > 0) {
      const relatedCats = products[0].relatedCategories;
      suggestions = await Product.find({ 
        category: { $in: relatedCats } 
      }).limit(4);
    }

    res.json({ products, suggestions });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;