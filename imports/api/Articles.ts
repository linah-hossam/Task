import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Article } from '../models/Article';

/**
 * The StuffsCollection. It encapsulates state and variable values for stuff.
 */
class ArticlesCollection {
  name: string;
  collection: Mongo.Collection<Article>;
  schema ;


  constructor() {
    // The name of this collection.
    this.name = 'articles';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection<Article>(this.name);
    // Define the structure of each document in the collection.
    const ArticleSchema = new SimpleSchema({
      title: String,
      description: String,
      createdOn: {
        type: Date,
        label: 'Created On',
        autoValue: function () {
          if (this.isInsert) {
            return new Date();
          }
        },
      },
      modifiedOn: {
        type: Date,
        label: 'Modified On',
        autoValue: function () {
          if (this.isInsert || this.isUpdate) {
            return new Date();
          }
        },
      },
      createdById:String,
    }, {

      clean: {
        filter: true,
        autoConvert: true,
        removeEmptyStrings: true,
        trimStrings: true,
        getAutoValues: true,
        removeNullsFromArrays: true,
    }
    });
    // Attach the schema to the collection, so all attempts to insert a document are checked against schema.
    this.schema = ArticleSchema;
    // Attach the schema to the collection, so all attempts to insert a document are checked against schema.
    this.collection.attachSchema(this.schema);    // Define names for publications and subscriptions
  }
}

/**
 * The singleton instance of the StuffsCollection.
 * @type {ArticlesCollection}
 */
export const Articles = new ArticlesCollection();

