const express = require('express');
const router = express.Router();

// Route to handle registration form submissions
router.post('/register', (req, res) => {
  // Here you'll handle the registration logic
  // For now, we'll just log the body and send a simple response
  console.log(req.body);
  res.status(200).send('Registration received');
});

module.exports = router;
