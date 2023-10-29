import { Meteor } from 'meteor/meteor';
import { Comments } from '../../../api/Comments';

Meteor.publish('comments', function publishComments() {
  return Comments.collection.find({});
});