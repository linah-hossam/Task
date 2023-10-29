import { Meteor } from "meteor/meteor";
import { Articles } from "/imports/api/Articles";
import {Comments} from "../../api/Comments";

Comments.collection.addLinks({
  'user': {
    type: 'one',
    collection: Meteor.users,
    field: 'createdById',
},
'articleComments':{
  type:'one',
  collection:Articles.collection,
  field:'articleId'
}

});
Articles.collection.addLinks({
  'user': {
      type: 'one',
      collection: Meteor.users,
      field: 'createdById',
  },
  'comments':{
    collection:Comments.collection,
    inversedBy:'articleComments'
  }
});

Articles.collection.addReducers({
  commentsCount: {
      body: {_id: 1},
      reduce(article) {
          const linker = Articles.collection.getLink(article, 'comments');
          // console.log(linker.find().count());
          return linker.find().count();
      }
  }
})

