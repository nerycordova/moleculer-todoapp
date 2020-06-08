"use strict";

const Task = require("../models/tasks.model");

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");


/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "tasks",

	mixins: [DbService],

	adapter: new MongooseAdapter(process.env.MONGODB_URL , { useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology: true }),

	model: Task,

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
		 * Create task
		 * @param {String} description - Description
		 * @param {Boolean} state - Task state
		 * @param {String} user_id - Task owner
		 */
		create: {
			rest:{
				method: "POST",
				path: "/"
			},
			params: {
				description: "string",
				state: {type: "boolean", default: false},
				user_id: "string"
			},
			async handler(ctx) {
				
				//Validate that user_id exists consuming USERS service
				const user = await ctx.call("users.read", { id:ctx.params.user_id });

				if (!user) throw new Error("User does not exist, operation not allowed.");

				const task = new Task(ctx.params);

				await task.save();

				return task;
				
			}
		},

		/**
		 * Retrieve task info
		 * @param {String} id - Task id
		 */
		read: {
			rest:{
				method: "GET",
				path: "/:id"
			},
			async handler(ctx){
				const task = await Task.findOne({_id:ctx.params.id});
				if (!task) throw new Error("Entity not found");
				return task;
			}
		},

		/**
		 * Update task
		 * @param {objectId} id - Task id
		 * @param {String} description - Updated task description
		 * @param {Boolean} state - Updated state
		 */
		update:{
			rest:{
				method: "PATCH",
				path: "/:id"
			},
			async handler(ctx){
				
				//Validate params
				const fields = Object.keys(ctx.params);
				const expectedFields = ["id","description","state"];
				const isValidOperation = fields.every( item => expectedFields.includes(item) );
				if (!isValidOperation) throw new Error("Invalid request");

				//Retrieve task
				const task = await Task.findOne({_id:ctx.params.id});
				if (!task) throw new Error("Task not found");

				//Update fields
				fields.forEach ( item => task[item] = ctx.params[item]);
				
				//Save object
				await task.save();

				return task;
			}
		},

		/**
		 * Delete task
		 * @param {objectId} id - Task id
		 */
		delete: {
			rest:{
				method: "DELETE",
				path: "/:id"
			},
			async handler(ctx){				

				const task = await Task.findOne({_id:ctx.params.id});
				if (!task) throw new Error("Entity not found");
				
				await task.remove();

				return task;
			}
		},

		/**
		 * Delete all tasks of a user
		 * @param {objectId} id - User id
		 */
		deleteUserTasks: {
			rest:{
				method: "DELETE",
				path: "/user/:id"
			},
			async handler(ctx){				

				await Task.deleteMany({user_id:ctx.params.id});

			}
		},

		/**
		 * Get list of all tasks
		 */
		list: {
			rest:{
				method: "GET",
				path: "/"
			},
			async handler(){
				return await Task.find();
			}
		},

		/**
		 * Get list of tasks by user
		 */
		listUserTasks: {
			rest:{
				method: "GET",
				path: "/user/:id"
			},
			async handler(ctx){

				return await Task.find({ user_id: ctx.params.id});
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
