import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Articles } from '../imports/api/Articles';
import '../imports/startup/server/Methods/ArticlesMethods';
import '../imports/startup/server/Methods/CommentsMethods';
import '../imports/startup/server/Publications/ArticlePublications';
import '../imports/startup/server/Publications/CommentsPublications';
import '../imports/startup/server/Methods/UsersMethods'
import '../imports/startup/server/links'
interface Article {
  title: string;
  description: string;
  date: Date;
}

// const insertArticle = (title: string, description: string) =>
//   ArticlesCollection.collection.insert({
//     title: title,
//     description: description,
//   });

const SEED_EMAIL = 'meteorite@gmail.com';
const SEED_PASSWORD = 'password';

Meteor.startup(() => {

    // Accounts.createUser({
    //   email: SEED_EMAIL,
    //   password: SEED_PASSWORD,
    // });
  

    // const articles: Article[] = [
    //   { title: 'Article 1', description: 'd1', date: new Date() },
    //   { title: 'Article 2', description: 'd2', date: new Date() },
    //   { title: 'Article 3', description: 'd3', date: new Date() },
    // ];
    // articles.forEach((article) => insertArticle(article.title, article.description));
  
});
