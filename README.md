*NodeJS, Express, MongoDB, Swagger, Passport, JWT starter kit*

### What is this

This is a rather simple example of an API that can do CRUD operations on documents stored in a MongoDB database.

This code started out as Wordnik's [swagger-node-express](https://github.com/wordnik/swagger-node-express) example.

### What's needed

This API runs on node.js, and makes use of the following:

- [Express](https://github.com/visionmedia/express) - node.js framework that handles routing
- [ExpressJS Extras](https://github.com/davglass/express-extras) - An add-on to Express that's used to add support for throttling
- [MongoDB](http://mongodb.com) - NoSQL database that holds our data
- [Mongoose](http://mongoosejs.com/) - ODM (object data mapping) layer, translates your data into JavaScript objects so you can work with them easier
- [Swagger UI](https://github.com/wordnik/swagger-ui) - Framework to help describe, produce, and test a RESTful web service


### Getting started with the API

Clone this project (or download the zip file), then run ```npm install``` to install the dependencies.

Next you'll want to create your own "config.js" and ".env" files.


```
/**
* Config file for the API
*/
exports.db_url = 'mongodb://your-mongo-host.com/database-name';

```

Now, startup up server with the command `npm run dev` or `yarn dev`, and you should see the messages below:


#### Have fun

At this point your API should be running and you can start testing it out. Thankfully, swagger-ui makes it really easy to start playing around with your API by automatically generating your API docs, and it even gives you the ability to test each of your methods without having to write your own code.

To see your API docs, just go to [http://localhost:8005/docs](http://localhost:8005/docs).

#### Known issues

Nothing right this moment, but I'm sure some problems are in there, I just haven't caught them yet. :)