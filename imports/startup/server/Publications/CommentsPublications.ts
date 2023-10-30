import { Meteor } from 'meteor/meteor';
import { Comments } from '../../../api/Comments';

Meteor.publish('comments', function publishComments() {
  const comments= Comments.collection.find({});
  const users=Meteor.users.find({});
  return([comments,users]);
});