import { Meteor } from 'meteor/meteor';
import { Articles } from '../../../api/Articles';

Meteor.publish('articles', function publishArticles() {
  return Articles.collection.find();
});