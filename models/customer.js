// models/customer.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  customerId: {
    type: String,
    unique: true
  },
  firstname: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters']
  },
  lastname: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters']
  },
  phone: {
    type: String,
    default: 'Not provided'
  },
  email: {
    type: String,
    default: 'Not provided'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Helper function to calculate required padding length
function calculatePaddingLength(count) {
  return Math.max(1, Math.floor(Math.log10(count)) + 1);
}

// Helper function to pad number with zeros
function padWithZeros(num, size) {
  return String(num).padStart(size, '0');
}

// Helper function to check if padding update is needed
function shouldUpdatePadding(currentCount, previousCount) {
  const currentPadding = calculatePaddingLength(currentCount);
  const previousPadding = calculatePaddingLength(previousCount);
  return currentPadding !== previousPadding;
}

// Pre-save middleware to handle ID generation and updates
userSchema.pre('save', async function(next) {
  try {
    if (!this.customerId) {
      // Count total documents
      const count = await this.constructor.countDocuments();
      const newId = count + 1;
      
      // Calculate required padding length
      const paddingLength = calculatePaddingLength(newId);
      
      // If this is a milestone number (10, 100, 1000, etc.)
      if (shouldUpdatePadding(newId, count)) {
        // Update all existing IDs with new padding
        const customers = await this.constructor.find({});
        for (const customer of customers) {
          const currentId = parseInt(customer.customerId);
          customer.customerId = padWithZeros(currentId, paddingLength);
          await customer.save();
        }
      }
      
      this.customerId = padWithZeros(newId, paddingLength);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Format the customer for display
userSchema.methods.toDisplay = function() {
  // Format date with fallback
  const formattedDate = this.createdAt ? new Date(this.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : 'Date not available';

  return {
    'ID': this.customerId,
    'Name': `${this.firstname} ${this.lastname}`,
    'Email': this.email,
    'Phone': this.phone,
    'Created': formattedDate
  };
};

// Static method to update ID padding for all documents
userSchema.statics.updateAllIds = async function() {
  const count = await this.countDocuments();
  const paddingLength = calculatePaddingLength(count);
  
  const customers = await this.find({}).sort({ customerId: 1 });
  
  for (let i = 0; i < customers.length; i++) {
    const customer = customers[i];
    const currentId = i + 1; // Ensure sequential order
    customer.customerId = padWithZeros(currentId, paddingLength);
    await customer.save();
  }
};

// Static method to resequence IDs after deletion
userSchema.statics.resequenceIds = async function() {
  const count = await this.countDocuments();
  const paddingLength = calculatePaddingLength(count);
  
  const customers = await this.find({}).sort({ customerId: 1 });
  
  // Resequence all IDs
  for (let i = 0; i < customers.length; i++) {
    const customer = customers[i];
    const newId = i + 1;
    customer.customerId = padWithZeros(newId, paddingLength);
    await customer.save();
  }
};

export default mongoose.model("customer", userSchema);