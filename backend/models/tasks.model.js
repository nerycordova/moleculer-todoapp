const mongoose  = require("mongoose");

const taskSchema = new mongoose.Schema({
	description: {
		type: String,
		required: true,
		trim: true
	},
	state: {
		type: Boolean,
		default: false
	},
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
},{
	timestamps:true
});


const Task = mongoose.model("Task", taskSchema);

module.exports = Task;