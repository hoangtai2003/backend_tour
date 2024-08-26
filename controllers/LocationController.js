import Location from '../models/Location.js'

// create new location
export const createLocation = async(req, res) => {
    const {name, description, parent_id, location_img, status} = req.body

    try {
        const newLocation = await Location.create({
            name,
            description,
            parent_id: parent_id || 0,
            location_img,
            status
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
        res.status(500).json({success:false,  message:'Failed to create location. Try again'})
    }
}

// update location 
export const updateLocation = async(req, res) => {
    const id = req.params.id
    const {name, description, parent_id, location_img, status} = req.body
    try {
        const locationToUpdate = await Location.findByPk(id)
        if(!locationToUpdate){
            return res.status(404).json({ success: false, message: 'Location not found' });
        }
        await locationToUpdate.update({
            name,
            description,
            parent_id: parent_id || locationToUpdate.parent_id,
            location_img,
            status
        })

        const updatedLocation = await Location.findByPk(id, {
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
        res.status(200).json({success:true, message:'Location successfully updated', data: updatedLocation})
    } catch (error) {
        res.status(500).json({success:false, error, message:'Failed to update location. Try again'})
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