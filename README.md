*NodeJS, Express, MongoDB, Swagger, Redis, JWT starter kit*

### What is this

This is a rather simple example of an API that can do CRUD operations on documents stored in a MongoDB database.

This code started out as Wordnik's [swagger-node-express](https://github.com/wordnik/swagger-node-express) example, but it's been changed so much that it doesn't make sense to just call it a fork of that repo. Speaking of that swagger-node-express repo, if you're looking for a good place to get started learning about creating an API with Swagger, that's a great project to take a look at.

### What's needed

This API runs on node.js, and makes use of the following:

- [Express](https://github.com/visionmedia/express) - node.js framework that handles routing
- [ExpressJS Extras](https://github.com/davglass/express-extras) - An add-on to Express that's used to add support for throttling
- [MongoDB](http://mongodb.com) - NoSQL database that holds our data
- [Mongoose](http://mongoosejs.com/) - ODM (object data mapping) layer, translates your data into JavaScript objects so you can work with them easier
- [Swagger UI](https://github.com/wordnik/swagger-ui) - Framework to help describe, produce, and test a RESTful web service


### Getting started with the API

Clone this projet (or download the zip file), then run ```npm install``` to install the dependencies.

Next you'll want to create your own "config.js" file. There's a file in the project called "config-sample.js" that you can copy to "config.js", and modify it to include the connection string to your database.

The file will look like the one below. Just replace the dummy connection string with the real one you'll be using.


```
/**
* Config file for the API
*/
exports.db_url = 'mongodb://username:password@your-mongo-host.com/database-name';

```

Now, startup up server with the command `npm run dev` or `yarn dev`, and you should see the messages below:

	Database connecting
	adding model def from models/carrier.js
	adding model def from models/manufacturer.js
	adding model def from models/phone.js
	Database connection established


#### Have fun

At this point your API should be running and you can start testing it out. Thankfully, swagger-ui makes it really easy to start playing around with your API by automatically generating your API docs, and it even gives you the ability to test each of your methods without having to write your own code.

To see your API docs, just go to [http://localhost:8002/docs](http://localhost:8005/docs).

#### Known issues

Nothing right this moment, but I'm sure some problems are in there, I just haven't caught them yet. :)