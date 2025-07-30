const express = require('express');
const router = express.Router();
const { buildFullMLMTreeFromAnyUser } = require('../utils/buildMLMTree');

router.get('/:id', async (req, res) => {
  try {
    const tree = await buildFullMLMTreeFromAnyUser(req.params.id);
    res.json(tree);
  } catch (err) {
    console.error('Error building MLM tree:', err);
    res.status(500).json({ error: 'Failed to build MLM tree' });
  }
});

module.exports = router;
