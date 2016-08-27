import mongoose, { Schema } from 'mongoose';

// create a schema for posts with a field
const PostSchema = new Schema({
  title: String,
  tags: String,
  content: String,
  author: String,
  image: String,
});

// for search functionality
PostSchema.index({ tags: 'text' });

// create model class
const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
