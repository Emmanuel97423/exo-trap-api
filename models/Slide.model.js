const mongoose = require('mongoose');
const Joi = require('joi');

const slideSchema = mongoose.Schema({ 
	codeSlide:{type:String, required:true},
    imageUrl: { type:String, required:true},
    title: { type:String, required:true},
    description: { type:String, required:true},

});

slideSchema.methods.joiValidate = function(obj) {
	var schema = {
		description: Joi.string().min(20).max(30).required(),
	
	}
	return Joi.validate(obj, schema);
}

module.exports = mongoose.model("Slide", slideSchema)