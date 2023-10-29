declare module "meteor/mongo" {
    import SimpleSchema  from "simpl-schema";
    namespace Mongo {
        interface Collection<T> {
            addLinks(arg0: Object): void;
            addReducers(arg0: Object): void;
            createQuery(arg0: Object): {
                fetchOne(): T | undefined  | null;
                getCount:() => number;
                fetch:() => T[];
            };
            /**
             * collection2 extension
             */
            attachSchema(schema: SimpleSchema): void;
        }
    }
}