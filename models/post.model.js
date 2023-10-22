const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)

const postSchema = new mongoose.Schema({
  title: String,
  post_category_id: {
    type: String,
    default: ""
  },
  preview: String,
  content: String,
  thumbnail: String,
  status: String,
  featured: String, // noi bat
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
  deletedAt: Date,
  createdBy: {
    account_id: String,
    createdAt: {
      type: Date
    },
  },
  deletedBy: {
    account_id: String,
    deletedAt: Date
  },
  updatedBy: [
    {
      account_id: String,
      updatedAt: Date
    }
  ]
}, {
  timestamps: {
    updatedAt: true
  }
});

const post = mongoose.model('post', postSchema, 'posts')

module.exports = post