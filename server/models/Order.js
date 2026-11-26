const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    customer: {
      fullName: { type: String, default: 'Student' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      hostelOrStreet: { type: String, default: 'Campus' },
      city: { type: String, default: 'Bengaluru' },
      pincode: { type: String, default: '560001' }
    },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
        productId: { type: String },
        title: { type: String },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true, default: 0 }
      }
    ],
    totalAmount: { type: Number, required: true, default: 0 },
    status: { type: String, default: 'Placed' }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);