const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)

const postCategorySchema = new mongoose.Schema({
  title: String,
  parent_id: {
    type: String,
    default: ""
  },
  description: String,
  thumbnail: String,
  status: String,
  position: Number,
  slug: {
    type: String,
    slug: 'title',
    unique: true
  },
  deleted: {
    type: Boolean,
    default: false
  },
  createdBy: {
    account_id: String,
    createdAt: {
      type: Date,
      default: Date.now()
    },
  },
  deletedBy: {
    account_id: String,
    deletedAt: Date
  },
  updatedBy: [
    {
      account_id: String,
      updatedAt: {
        type: Date,
        default: Date.now()
      }
    }
  ]
}, {
  // timestamps: true
});

const postCategory = mongoose.model('postCategory', postCategorySchema, 'posts-category')

module.exports = postCategory