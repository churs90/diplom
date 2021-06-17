const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const {isAuth} = require('../middlewares/auth');
const message = require('../models/Message');

router.get('/:id', (req,res) => {
	const { id } = req.params;

	Message.findById(id)
		.then(message =>
			message
				? res.status(200).json({code: 200, response: message})
				: res.status(404).json({code: 404, message: 'Post not found'}))
		.catch(e => res.send(500).json({error: 'Unexpected error.'}));
});

router.delete('/:id', isAuth, (req,res) => {
	const { id } = req.params;
	
	Message.findOneAndDelete({
		_id: id
		})
		.exec((err, message) => {
			if(err)
				return res.status(500).json({code: 500, message: 'There was an error deleting the post', error: err})
			res.status(200).json({code: 200, message: 'Message deleted', deletedMessage: message})
		});
})

module.exports = router;
