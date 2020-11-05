const connections = {};
module.exports = {
	storeConnection: (socketObj) => {
		const userId = socketObj.handshake.query.userId

		const currentConnections = module.exports.getConnections()
	
		currentConnections[userId] = socketObj.id
		
	},

	getConnections: () => {
		return connections;
	},

	removeConnection: (userId) => {
		const currentConnections = module.exports.getConnections()

		delete currentConnections[userId]
	}
}