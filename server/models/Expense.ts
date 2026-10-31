import mongoose, { Document, Schema } from 'mongoose';

export interface IExpense extends Document {
  eventId: mongoose.Types.ObjectId | string;
  title: string;
  category: string;
  estimatedCost: number;
  actualCost: number;
  paidAmount: number;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    eventId: { type: Schema.Types.Mixed, required: true, index: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Venue', 'Catering', 'Decoration', 'Photography', 'Music & DJ', 'Attire & Makeup', 'Transportation', 'Invitations', 'Other'],
    },
    estimatedCost: { type: Number, default: 0 },
    actualCost: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Partially Paid', 'Fully Paid'],
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const ExpenseModel = mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
