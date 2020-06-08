
"use strict";

const User = require("../models/users.model");

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");


/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "users",

	mixins: [DbService],

	adapter: new MongooseAdapter(process.env.MONGODB_URL_USERS_SERVICE , { useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology: true }),

	model: User,

	/**
	 * Settings
	 */
	settings: {

	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {

		/**
		 * Create user
		 * @param {String} name - User name
		 */
		create: {
			rest:{
				method: "POST",
				path: "/"
			},
			params: {
				name: "string"
			},
			async handler(ctx) {
				//return `Create user: ${.name}`;
				const user = new User(ctx.params);

				await user.save();

				return user;
			}
		},

		/**
		 * Retrieve user info
		 * @param {String} id - User id
		 */
		read: {
			rest:{
				method: "GET",
				path: "/:id"
			},
			async handler(ctx){
				const user = await User.findOne({_id:ctx.params.id});
				if (!user) throw new Error("Entity not found");
				return user;
			}
		},

		/**
		 * Update user
		 * @param {objectId} id - User id
		 * @param {String} name - Updated user name
		 */
		update:{
			rest:{
				method: "PATCH",
				path: "/:id"
			},
			async handler(ctx){
				
				const fields = Object.keys(ctx.params);
				const expectedFields = ["id","name"];
				const isValidOperation = fields.every( item => expectedFields.includes(item) );
				if (!isValidOperation) throw new Error("Invalid request");

				const user = await User.findOne({_id:ctx.params.id});
				if (!user) throw new Error("User not found");

				user.name = ctx.params.name;
				await user.save();

				return user;
			}
		},

		/**
		 * Delete user
		 * @param {objectId} id - User id
		 */
		delete: {
			rest:{
				method: "DELETE",
				path: "/:id"
			},
			async handler(ctx){				

				const user = await User.findOne({_id:ctx.params.id});
				if (!user) throw new Error("Entity not found");
				
				await user.remove();

				return user;
			}
		},

		/**
		 * Get list of all users
		 */
		list: {
			rest:{
				method: "GET",
				path: "/"
			},
			async handler(){
				return await User.find();
			}
		}

	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
