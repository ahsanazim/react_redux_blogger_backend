import mongoose, { Schema } from 'mongoose';

// create a schema for posts with a field
const TagSchema = new Schema({
  name: String,
});

// create model class
const TagModel = mongoose.model('Tag', TagSchema);

export default TagModel;
