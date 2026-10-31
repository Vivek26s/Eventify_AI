import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  eventId: mongoose.Types.ObjectId | string;
  title: string;
  category: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    eventId: { type: Schema.Types.Mixed, required: true, index: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, default: 'General' },
    dueDate: { type: String, default: '' },
    priority: {
      type: String,
      default: 'Medium',
      enum: ['High', 'Medium', 'Low'],
    },
    completed: { type: Boolean, default: false },
    assignedTo: { type: String, default: '' },
  },
  { timestamps: true }
);

export const TaskModel = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
