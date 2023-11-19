const express = require('express');
const router = express.Router();


router.get('/most-viewed', (req, res) => {
  if (parseInt(req.query.count)) {
    req.query.count = parseInt(req.query.count)
    req.query.count = (req.query.count <= 10 && req.query.count > 0)? req.query.count : 10;
  } else {
    req.query.count = 10;
  }

  const respose_data = {
    "anime-ids"   : ['4456', '8595', '8256', '1204', '3132', '4456', '8595', '8256', '1204', '3132'].slice(0, req.query.count),
    "desire-count": req.query.count
  }

  res.status(200);
  res.send(respose_data);
});

module.exports = router;
