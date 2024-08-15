import Location from '../models/Location.js'

// create new location
export const createLocation = async(req, res) => {
    try {
        const newLocation = await Location.create(req.body)
        res.status(200).json({success:true, message:'Successfully created', data: newLocation})
    } catch (error) {
        res.status(500).json({success:false, message:'Failed to create. Try again'})
    }
}

// update location 
export const updateLocation = async(req, res) => {
    const id = req.params.id
    try {
        const location = await Location.findByPk(id)
        if(!location){
            return res.status(404).json({ success: false, message: 'Location not found' });
        }
        await location.update(req.body)
        res.status(200).json({success:true, message:'Successfully updated', data: location})
    } catch (error) {
        res.status(500).json({success:false, message:'Failed to update. Try again'})
    }
}

// delete location
export const deleteLocation = async(req, res) => {
    const id = req.params.id
    try { 
        const result = await Location.destroy({ where: { id } });
        if (result === 0) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }
        res.status(200).json({success:true, message:'Successfully deleted'})
    } catch(err) {
        res.status(500).json({success:false, message:'Failed to delete. Try again'})
    }
}

//get signle location 
export const getSingleLocation= async(req, res) => {
    const id = req.params.id
    try {
        const location = await Location.findByPk(id)
        if (!location) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }
        res.status(200).json({success:true, message: "Successfully", data: location})
    } catch(err) {
        res.status(500).json({success:false, message:'Not Found'})
    }
}

// get all location
export const getAllLocation= async(req, res) => {
    try {
        const locations = await Location.findAll()
        res.status(200).json({success:true, message: "Successfully", data: locations})
    } catch(err) {
        res.status(500).json({success:false, message:'Not Found'})
    }
}