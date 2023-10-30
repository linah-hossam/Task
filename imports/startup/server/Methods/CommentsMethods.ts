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
  const comment=Comments.collection.findOne({_id:_id})
  if (!this.userId||comment?.createdById!=this.userId) {
    throw new Meteor.Error('Not authorized.');
  }else{
    console.log("can delete!")
    Comments.collection.remove(_id);
  }
},
  'comments.articledelete'(id){
    Comments.collection.remove({articleId:id})
  }
});