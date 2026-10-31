import mongoose, { Document, Schema } from 'mongoose';

export interface IVendor extends Document {
  eventId: mongoose.Types.ObjectId | string;
  name: string;
  category: string;
  contactPerson: string;
  phone: string;
  email: string;
  quotedPrice: number;
  status: string;
  rating?: number;
  notes?: string;
  isDemo?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema = new Schema<IVendor>(
  {
    eventId: { type: Schema.Types.Mixed, required: true, index: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Venue', 'Catering', 'Decoration', 'Photography', 'Music & DJ', 'Transportation', 'Other'],
    },
    contactPerson: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    quotedPrice: { type: Number, default: 0 },
    status: {
      type: String,
      default: 'Inquired',
      enum: ['Inquired', 'Quoted', 'Shortlisted', 'Booked', 'Completed'],
    },
    rating: { type: Number, default: 5 },
    notes: { type: String, default: '' },
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const VendorModel = mongoose.models.Vendor || mongoose.model<IVendor>('Vendor', VendorSchema);
