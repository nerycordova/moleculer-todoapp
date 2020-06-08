"use strict";

const { ServiceBroker } = require("moleculer");
//const { ValidationError } = require("moleculer").Errors;
const TestService = require("../../../services/tasks.service");
const UserService = require("../../../services/users.service");

const { 
	taskId,
	taskToBeCreated, 
	setupDatabase
} = require("../../fixtures/tasks.db");


describe("Test 'tasks' service", () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(TestService);
	broker.createService(UserService);

	beforeAll(async () => {
		broker.start();
		await setupDatabase();
	});

	afterAll(() => broker.stop());

	describe("Test 'service.create' action", () => {

		it("should create task", async () => {

			const user = (await broker.call("users.list"))[0];
			
			const res = await broker.call("tasks.create", {description: taskToBeCreated.description, user_id: user._id.toString() });
			expect(res.description).toEqual(taskToBeCreated.description);
			expect(res.user_id).toEqual(user._id);
			expect(res.state).toEqual(false);
		});

	});

	describe("Test 'service.read' action", () => {

		it("should retrieve no tasks found", async () => {
			//create task
			const user = (await broker.call("users.list"))[0];
			const task = await broker.call("tasks.create", {description: taskToBeCreated.description, user_id: user._id.toString() });

			//read task
			const res = await broker.call("tasks.read", { id: task._id });
			expect(res.description).toEqual(taskToBeCreated.description);
		});

	});

	describe("Test 'service.update' action", () => {

		it("should update task", async () => {
			//create task
			const user = (await broker.call("users.list"))[0];
			const task = await broker.call("tasks.create", {description: taskToBeCreated.description, user_id: user._id.toString() });
			//Update task, set state to completed
			const updated = await broker.call("tasks.update", { id: task._id, state: true });
			expect(updated.state).toEqual(true);
		});

	});


	describe("Test 'service.list' action", () => {

		it("should return tasks", async () => {
			
			const res = await broker.call("tasks.list");
			
			expect(res.length).toBeGreaterThan(0);
		});

	});

	describe("Test 'service.delete' action", () => {

		it("should delete task", async () => {
			//create task
			const user = (await broker.call("users.list"))[0];
			const task = await broker.call("tasks.create", {description: taskToBeCreated.description, user_id: user._id.toString() });
			//delete task
			const deleted =  await broker.call("tasks.delete", { id: task._id });
			expect(task._id).toEqual(deleted._id);
		});

	});

	describe("Test 'service.listUserTasks' action", () => {

		it("should get list of tasks of a user", async () => {
			//create user
			const user = await broker.call("users.create", { name: "Multi Tasker User" });
			
			//create tasks
			const tasks = ["task 1", "task 2", "task 3"];
			const promises = [];
			tasks.forEach( item =>  promises.push(broker.call("tasks.create", {description: item, user_id: user._id.toString() })));
			await Promise.all(promises);
			
			//List user's tasks
			const tasksCreated = await broker.call("tasks.listUserTasks", {id : user._id});
			expect(tasksCreated.length).toEqual(tasks.length);
			
		});

	});


});

