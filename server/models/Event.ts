import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  userId: mongoose.Types.ObjectId | string;
  name: string;
  category: string;
  date: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  currency: string;
  themePreference: string;
  description: string;
  additionalRequirements?: string;
  aiPlan?: any;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    userId: { type: Schema.Types.Mixed, required: true, index: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Wedding', 'Birthday', 'Anniversary', 'College Fest', 'Corporate', 'Community', 'Other'],
    },
    date: { type: String, required: true },
    location: { type: String, required: true },
    guestCount: { type: Number, required: true, min: 1 },
    totalBudget: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    themePreference: { type: String, default: 'Modern & Elegant' },
    description: { type: String, default: '' },
    additionalRequirements: { type: String, default: '' },
    aiPlan: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const EventModel = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
