var mongoose = require('mongoose');
var Scheme = mongoose.Schema;

module.exports = mongoose.model('Status',new Scheme(
  {
    name : String,
    genre : [String]
  }
));
