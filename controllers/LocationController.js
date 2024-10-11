import Location from '../models/Location.js'
import { createSlug } from '../utils/slug.js';
// create new location
export const createLocation = async(req, res) => {
    const {name, description, parent_id, status} = req.body
    const location_img = req.files;
    const loca_slug = createSlug(name)
    try {
        const newLocation = await Location.create({
            name,
            description,
            parent_id: parent_id || 0,
            location_img: `http://localhost:4000/images/locations/${location_img[0].filename}`,
            status,
            loca_slug
        })

        const locationWithRelations = await Location.findByPk(newLocation.id, {
            include: [
                {
                    model: Location,
                    as: 'parent'
                },
                {
                    model: Location,
                    as: 'children'
                }
            ]
        })
        res.status(200).json({success:true, message:'Location successfully created', data: locationWithRelations})
    } catch (error) {
        res.status(500).json({success:false, error,  message:'Failed to create location. Try again'})
    }
}

// update location 
export const updateLocation = async(req, res) => {
    const { id }= req.params
    const {name, description, parent_id, status} = req.body
    const location_img = req.files;
    const loca_slug = createSlug(name)
    try {
        const locationToUpdate = await Location.findByPk(id)
        if(!locationToUpdate){
            return res.status(404).json({ success: false, message: 'Location not found' });
        }
        const updateData = {
            name,
            description,
            parent_id: parent_id || locationToUpdate.parent_id,
            status,
            loca_slug
        }
        if (location_img && location_img.length > 0) {
            updateData.location_img = `http://localhost:4000/images/locations/${location_img[0].filename}`;
        }
        await locationToUpdate.update(updateData)  
        
        res.status(200).json({success:true, message:'Location successfully updated', data: locationToUpdate})
    } catch (error) {
        res.status(500).json({success:false, message:'Failed to update location. Try again'})
    }
}

// delete location
export const deleteLocation= async(req, res) => {
    const id = req.params.id
    try {
        const locationToDelete = await Location.findByPk(id)

        if (!locationToDelete) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }

        // Xóa tất cả danh mục con cần xóa
        await Location.destroy({
            where: {
                parent_id: id
            }
        });

        // Xóa danh mục chính
        await locationToDelete.destroy()
        res.status(200).json({
            success: true,
            message: 'Location successfully deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete location. Try again later.'
        });
    } 
}

//get signle location 
export const getSingleLocation = async (req, res) => {
    const id = req.params.id;

    try {
        // Tìm danh mục theo ID và bao gồm các danh mục con
        const location = await Location.findByPk(id, {
            include: [
                { model: Location, as: 'parent' },
                { model: Location, as: 'children' } 
            ]
        });

        // Kiểm tra nếu danh mục không tồn tại
        if (!location) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }

        res.status(200).json({ success: true, message: 'Successfully fetched location', data: location });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch location' });
    }
}

// get all location
export const getAllLocationPagination = async(req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const offset = (page - 1) * limit
    try {

        const { count, rows } = await Location.findAndCountAll({
            limit, 
            offset,
            distinct: true,
            include: [
                { model: Location, as: 'parent' },
                { model: Location, as: 'children' } 
            ]
        });

        res.status(200).json({
            success: true,
            count: count, 
            totalPages: Math.ceil(count / limit),  
            currentPage: page,  
            message: "Successfully retrieved location",
            data: rows   
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch location' });
    }
}

export const getAllLocation = async (req, res) => {
    try {
        const locations = await Location.findAll({
            include: [
                { model: Location, as: 'parent' },
                { model: Location, as: 'children' } 
            ]
        });

        if (!locations) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }

        res.status(200).json({ success: true, message: 'Successfully fetched location', data: locations });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch location' });
    }
}