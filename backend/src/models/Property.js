const mongoose = require('mongoose')

const DOCUMENT_TYPES = [
  'Ownership Deed',
  'Inheritance Document',
  'Will',
  'Trust Document',
  'Survey Map',
  'Property Tax Receipt',
  'Chain of Ownership',
  'Court Order',
  'Other',
]

const documentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: DOCUMENT_TYPES },
    uploadedAt: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    size: { type: String, default: '' },
    // Google Drive file reference (Phase 4+ integration).
    driveFileId: { type: String, default: '' },
  },
  { _id: true },
)

const visitSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    note: { type: String, trim: true, default: '' },
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },
  },
  { _id: true },
)

const propertySchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Agricultural Land',
        'Residential Plot',
        'Commercial Property',
        'Open Land',
        'Farm',
        'Industrial Land',
        'Other',
      ],
    },
    ownership: {
      type: String,
      required: true,
      enum: ['Purchased', 'Inherited', 'Gifted', 'Trust', 'Court Transfer'],
    },
    purchaseDate: { type: String },
    purchasePrice: { type: Number, min: 0 },
    area: { type: Number, required: true, min: 0 },
    areaUnit: {
      type: String,
      required: true,
      enum: ['acres', 'hectares', 'sqft', 'sqm', 'guntha', 'bigha'],
    },
    marketValue: { type: Number, min: 0 },
    previousOwner: { type: String, trim: true },
    notes: { type: String, trim: true },
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },
    documents: { type: [documentSchema], default: [] },
    visits: { type: [visitSchema], default: [] },
  },
  { timestamps: true },
)

propertySchema.set('toJSON', {
  virtuals: true,
  transform(_doc, ret) {
    delete ret.__v
    return ret
  },
})

module.exports = mongoose.model('Property', propertySchema)
module.exports.DOCUMENT_TYPES = DOCUMENT_TYPES
