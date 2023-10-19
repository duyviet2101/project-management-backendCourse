const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    permissions: {
      type: Array,
      default: []
    },
    deleted: {
      type: Boolean,
      default: false,
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
    ],
    createdBy: {
      account_id: String,
      createdAt: {
        type: Date,
        default: Date.now()
      },
    },
  },
  {
    // timestamps: true 
  }
);

const Role = mongoose.model("Role", roleSchema, "roles");

module.exports = Role;