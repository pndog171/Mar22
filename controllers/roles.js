let roleModel = require('../schemas/role');

module.exports = {
    GetAllUser: async function () {
        return await roleModel.find({
            status: true
        });
    },
    CreateARole: async function (name) {
        try {
            // Check if role already exists
            let existingRole = await roleModel.findOne({ name: name });
            if (existingRole) {
                return existingRole;
            }
            
            // Create new role if it doesn't exist
            let role = new roleModel({
                name: name
            });
            return await role.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }
};