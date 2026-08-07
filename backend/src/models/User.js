const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    initials: { type: String, required: true },
    plan: { type: String, enum: ['Free', 'Pro'], default: 'Free' },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

/** Strip sensitive fields from JSON serialization. */
userSchema.set('toJSON', {
  virtuals: true,
  transform(_doc, ret) {
    delete ret.passwordHash
    delete ret.__v
    return ret
  },
})

module.exports = mongoose.model('User', userSchema)
