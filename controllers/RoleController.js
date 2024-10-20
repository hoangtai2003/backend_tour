import Permissions from "../models/Permissions.js"
import RolePermissions from "../models/RolePermissions.js"
import Roles from "../models/Roles.js"
import { createSlug } from "../utils/slug.js"

export const createRole = async(req, res) => {
    const { name, permission_id } = req.body
    try {
        const permissions = permission_id || [];
        const newRole = await Roles.create({name})

        if (permissions && Array.isArray(permissions)){
            const rolePermissionPromises = permissions.map(permission_id => {
                return RolePermissions.create({
                    role_id: newRole.id,
                    permission_id
                })
            })
            await Promise.all(rolePermissionPromises);
        }
        res.status(200).json({ 
            success: true, 
            message: 'Tạo vai trò thành công', 
            data: newRole
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:'Đã có lỗi xảy ra. Vui lòng thử lại !'})
    }
    

}

export const getAllRole = async(req, res) => {
    try {
        const roles = await Roles.findAll({
            include : [
                {
                    model: Permissions,
                    as: 'rolePermission',
                    through: { attributes: ['permission_id'] }, 
                    attributes: ['name']
                }
            ]
        })
        
        res.status(200).json({success:true, message: "Successfully", data: roles})
    } catch(err) {
        res.status(500).json({success:false, message:'Not Found'})
    }
}

export const createPermission = async(req, res) => {
    const { name } = req.body
    const slug = createSlug(name)
    try {
        const permission = await Permissions.create({
            name,
            slug
        })
        res.status(200).json({success:true, message: "Tạo permission thành công", data: permission})
    } catch (error) {
        res.status(500).json({success:false, message:'Đã có lỗi xảy ra. Vui lòng thử lại !'})
    }
}

export const getAllPermission = async(req, res) => {
    const permission = await Permissions.findAll()
    res.status(200).json({success:true, message:"", data: permission})
}

export const getRole = async(req, res) => {
    const { id } = req.params
    
    try {
        const role = await Roles.findByPk(id, {
            include : [
                {
                    model: Permissions,
                    as: 'rolePermission',
                    through: { attributes: ['permission_id'] }, 
                    attributes: ['name']
                }
            ]
        })
        res.status(200).json({success:true, message: "Successfully", data: role})
    } catch (error) {
        res.status(500).json({success:false, message:'Not Found'})
    }
    
}

export const editRole = async(req, res) => {
    const { id } = req.params
    const { permission_id } = req.body
    const permissions = permission_id || [];
    try {
        const role = await Roles.findByPk(id)
        if (!role) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy role' });
        }
        if (permissions && Array.isArray(permissions)){
            await RolePermissions.destroy({ where: { role_id: id }})
            const rolePermissionPromises = permissions.map(permission_id => {
                return RolePermissions.create({
                    role_id: id,
                    permission_id: permission_id
                })
            })
            await Promise.all(rolePermissionPromises);
        }
        res.status(200).json({ 
            success: true, 
            message: 'Cập nhật vai trò thành công', 
            data: role
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ 
            success: false, 
            message: 'Đã có lỗi xảy ra. Vui lòng thử lại!',
        });
    }
}