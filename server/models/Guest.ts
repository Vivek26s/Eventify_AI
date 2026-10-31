import mongoose, { Document, Schema } from 'mongoose';

export interface IGuest extends Document {
  eventId: mongoose.Types.ObjectId | string;
  name: string;
  email: string;
  phone: string;
  group: string;
  status: 'Attending' | 'Declined' | 'Pending';
  plusOnes: number;
  dietaryRestrictions?: string;
  tableNumber?: string;
  invitationSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GuestSchema = new Schema<IGuest>(
  {
    eventId: { type: Schema.Types.Mixed, required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    group: {
      type: String,
      default: 'Friends',
      enum: ['Family', 'Friends', 'VIP', 'Colleagues', 'General'],
    },
    status: {
      type: String,
      default: 'Pending',
      enum: ['Attending', 'Declined', 'Pending'],
    },
    plusOnes: { type: Number, default: 0 },
    dietaryRestrictions: { type: String, default: '' },
    tableNumber: { type: String, default: '' },
    invitationSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const GuestModel = mongoose.models.Guest || mongoose.model<IGuest>('Guest', GuestSchema);
