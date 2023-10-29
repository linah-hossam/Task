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

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    Articles.collection.remove(_id);
  },

  'articles.update'(_id, description) {
    // check(taskId, String);
    // check(isChecked, Boolean);
 
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    Articles.collection.update(_id, {
      $set: {
        description,
      }
    });
  },
//   'articles.getAll'(page){
//     const skipCount = (page- 1) * 10;
//     const articles= Articles.collection.find({}, { sort: { createdOn: -1 },limit: 10, skip: skipCount }).fetch();
//     // console.log("helloooo");
//     // console.log(articles);
    
//     return articles;
// },

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

'articles.getMyArticles'(_id){
  const query = Articles.collection.createQuery({
    $filters: {
        createdById: _id,
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
    // console.log(x);
    var searchvar  = new RegExp("^" + x);
    const query = Articles.collection.createQuery({
      $filters: {
        $or: [
          { title: { $regex: searchvar } },
          { description: { $regex: searchvar } }
        ]
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
    comments:{
      text:1
    },
    commentsCount:1

  });
  return query.fetch().slice((page-1)*10,page*10);
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
