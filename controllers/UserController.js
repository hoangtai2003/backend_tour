import User from '../models/User.js'

// create new user
export const createUser = async (req, res) => {
    const newUser = new User(req.body)
    try {
        const saveUser = await newUser.save()
        res.status(200).json({success:true, message:'Successfully created', data: saveUser})
    } catch(err) {
        res.status(500).json({success:false, message:'Failed to create. Try again'})
    }
}

// update user 
export const updateUser = async(req, res) => {
    const id = req.params.id
    try {
        const updateUser = await User.findByIdAndUpdate(id, {
            $set: req.body
        }, {new: true})
        res.status(200).json({success:true, message:'Successfully updated', data: updateUser})
    } catch(err){
        res.status(500).json({success:false, message:'Failed to update. Try again'})
    }
}

// delete user 
export const deleteUser = async(req, res) => {
    const id = req.params.id
    try {
        await User.findByIdAndDelete(id)
        res.status(200).json({success:true, message:'Successfully deleted'})
    } catch(err) {
        res.status(500).json({success:false, message:'Failed to delete. Try again'})
    }
}

// get single uer
export const getSingleUser = async(req, res) => {
    const id = req.params.id
    try {
        const user = await User.findById(id)
        res.status(200).json({success:true, message: "Successfully", data: user})
    } catch(err) {
        res.status(500).json({success:false, message:'Not Found'})
    }
}

// get all User 
export const getAllUser = async(req, res) => {
    try {
        const users = await User.find({})
        res.status(200).json({success:true, message: "Successfully", data: users})
    } catch(err) {
        res.status(500).json({success:false, message:'Not Found'})
    }
}