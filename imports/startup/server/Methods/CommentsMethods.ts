import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Comments } from '../../../api/Comments';
import {links} from '../links'

Meteor.methods({
  'comments.insert'(text,_id) {
    check(text, String);
    check(_id,String)
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    Comments.collection.insert({
        articleId: _id,
        text: text,
        createdById:this.userId,
    })
  },
'comments.remove'(_id){
    Comments.collection.remove(_id);
}
  
});