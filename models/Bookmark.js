import mongoose from 'mongoose';
// Register the referenced models so populate() works in any route that only imports Bookmark.
import './User';
import './Job';

const bookMarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate bookmarks at database level
bookMarkSchema.index({ user: 1, job: 1 }, { unique: true });

export default mongoose.models.BookMarkJob || mongoose.model('BookMarkJob', bookMarkSchema);