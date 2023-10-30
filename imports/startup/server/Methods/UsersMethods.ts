import { Accounts } from 'meteor/accounts-base';
import SimpleSchema from 'simpl-schema';
import _ from 'underscore';
import { Meteor } from 'meteor/meteor';
import { Match, check } from 'meteor/check';


Accounts.onCreateUser((options, user) => {
    // console.log("userMethods");
    // console.log(user);
    // console.log("options:")
    console.log(options);
    user.profile=options.profile;
    return user;
});