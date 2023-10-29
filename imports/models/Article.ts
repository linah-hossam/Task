export interface Article{
    _id?:string;
    title?: String,
    description?: String,
    createdOn?: Date,
    modifiedOn?:Date,
    createdById?:String,
}