"use strict";

const { ServiceBroker } = require("moleculer");
//const { ValidationError } = require("moleculer").Errors;
const TestService = require("../../../services/users.service");

const { 
	userOne, 
	userTwo, 
	userToBeCreated, 
	setupDatabase
} = require("../../fixtures/users.db");

describe("Test 'users' service", () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(TestService);

	beforeAll(async () => {
		broker.start();
		await setupDatabase();
	});

	afterAll(() => broker.stop());

	describe("Test 'service.create' action", () => {

		it("should create user", async () => {
			const res = await broker.call("users.create", { name: userToBeCreated.name });
			expect(res.name).toEqual(userToBeCreated.name);
		});

	});

	describe("Test 'service.read' action", () => {

		it("should retrieve user", async () => {
			const res = await broker.call("users.read", { id: userOne._id });
			expect(res._id).toStrictEqual(userOne._id);
		});

	});

	describe("Test 'service.update' action", () => {

		it("should update user", async () => {
			const newName = "Mark Doe";
			const res = await broker.call("users.update", { id: userOne._id, name: newName });
			expect(res.name).toEqual(newName);
		});

	});


	describe("Test 'service.list' action", () => {

		it("should return users", async () => {
			const expected = [{ _id: userOne._id }, { _id: userTwo._id }];
			const res = await broker.call("users.list");
			//Clean response to conatin only _id
			const usersArr = res.map( item => {
				return {_id: item._id};
			});
			expect(usersArr).toEqual(expect.arrayContaining(expected));
		});

	});

	describe("Test 'service.delete' action", () => {

		it("should delete user", async () => {
			const res = await broker.call("users.delete", { id: userOne._id });
			expect(res._id).toStrictEqual(userOne._id);
		});

	});


});

