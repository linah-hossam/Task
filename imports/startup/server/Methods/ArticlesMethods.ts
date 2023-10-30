import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Articles } from '../../../api/Articles';
import {links} from '../links'
Meteor.methods({
  'articles.insert'(title,description) {
    check(title, String);
    check(description,String);
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const articleId = Articles.collection.insert({
      title,
      description,
      createdById: this.userId,
    });
  
    return articleId;
  },

  'articles.remove'(_id) {
    check(_id, String);
    const article=Articles.collection.findOne(_id);
    if (!this.userId||article?.createdById!=this.userId) {
      throw new Meteor.Error('Not authorized.');
    }else{
      Articles.collection.remove(_id);
    }
    
  },

  'articles.update'(_id, description) {
    // check(taskId, String);
    // check(isChecked, Boolean);
 
    const article=Articles.collection.findOne(_id);
    if (!this.userId||article?.createdById!=this.userId) {
      throw new Meteor.Error('Not authorized.');
    }else{
      Articles.collection.update(_id, {
        $set: {
          description,
        }
      });
    }
  },
'articles.getArticle'(id){
  const query = Articles.collection.createQuery({
    $filters: {
        _id: id,
    },
      title: 1,
        description:1,
        createdOn: 1,
        createdById: 1,
        user: {
          profile: 1,
          email: 1
      },
      commentsCount:1
  });
  return query.fetchOne();
},

'articles.getMyArticles'(){
  const query = Articles.collection.createQuery({
    $filters: {
        createdById: this.userId,
    },
    $options: {
        sort: {createdOn: -1}
    },
      title: 1,
        description:1,
        createdOn: 1,
        createdById: 1,
        user: {
          profile: 1,
          email: 1
      },
      commentsCount:1
  });
  return query.fetch();
},
'articles.count'(){
  const query= Articles.collection.createQuery({
    title: 1,
    description:1,
    createdOn: 1,
    createdById: 1,
    user: {
      profile: 1,
      email: 1
  }
  })
    return (query.getCount());
},
'articles.filter'(x,page){
  if(!this.userId){
    return ("Unathorized access!");
  }
    var searchvar  = new RegExp("^" + x);
    const query = Articles.collection.createQuery({
      $filters: {
        $or: [
          { title: { $regex: searchvar } },
          { description: { $regex: searchvar } }
        ]
      },
      $options: {
          sort: {createdOn: -1},
          limit: 10,
          skip: (page - 1) * 10
      },
      title: 1,
      description:1,
      createdOn: 1,
      createdById: 1,
      user: {
        profile: 1,
        email: 1
    },
    comments:{
      text:1
    },
    commentsCount:1

  });
  return query.fetch();
},
// 'articleComments'(id){
//   const query=Articles.collection.createQuery({
//     $filters: {
//       _id:id,
//   },
//     commentsCount:1
//   });
//   const c= query.fetchOne();
//   console.log(c);
//   return query.fetchOne();
// }
});
