import { Mongo } from 'meteor/mongo';
import { Comment } from '../models/Comment';
import SimpleSchema from 'simpl-schema';
class CommentsCollection{
    name: string;
    collection: Mongo.Collection<Comment>;
    schema ;
    constructor(){
        this.name="comments";
        this.collection = new Mongo.Collection<Comment>(this.name);
        this.schema =new SimpleSchema({
            _id:String,        
            text:String,
            articleId:String,
            createdOn: {
                type: Date,
                label: 'Created On',
                autoValue: function () {
                  if (this.isInsert) {
                    return new Date();
                  }
                },
              },
            createdById:String,

        })
        this.collection.attachSchema(this.schema);
    }    
    
}

export const Comments :CommentsCollection= new CommentsCollection();