import { Op } from "sequelize";
import Location from "../models/Location.js";
import TourChild from "../models/TourChild.js";
import TourRequests from "../models/TourRequests.js";
import User from "../models/User.js";
import Tour from "../models/Tour.js";

export const registerTour  = async(req, res) => {
    const { guideId, tour_child_id } = req.body
    try {
        const newRequest = await TourRequests.create({
            tour_child_id,
            guideId,
            status: "Đang chờ" 
        });
        res.status(200).json({ success: true, message: 'Yêu cầu đăng ký tour đã được gửi. Đang chờ xác nhận từ admin.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' });
    }
}

export const updateTourRequest = async(req, res) => {
    const { status } = req.body;
    const { requestId } = req.params
    try {
        const request = await TourRequests.findByPk(requestId);
        if (!request) {
            return res.status(404).json({ success: false, message: 'Yêu cầu không tồn tại.' });
        }
        await request.update({ status });

        const tour = await TourChild.findByPk(request.tour_child_id)
        await tour.update({ guideId: request.guideId, status_guide: "Đã có hướng dẫn viên" });
        res.status(200).json({ success: true, message: 'Yêu cầu đăng ký đã được chấp nhận.' });
        
    } catch (error) {
        res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' });
    }
}

export const getAllRequest = async(req, res) => {
    try {
        const request = await TourRequests.findAll({
            attributes: ['status', 'id'],
            include: [
                {
                    model: User,
                    as: 'tourRequestsUser',
                    attributes: ['username', 'email', 'phone', 'address', 'dateBirthday', 'gender'],
                    include: [
                        {
                            model: Location,
                            as: 'userLocation',
                            attributes: ['name']
                        }
                    ]
                },
                {
                    model: TourChild,
                    as: 'tourRequestsChild',
                    attributes: ['tour_code', 'start_date']
                }
            ]
        })
        res.status(200).json({ success: true, data:request });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' });
    }
}
export const getAllRequestApproved = async(req, res) => {
    const id  = req.user.id
    try {
        const request = await User.findByPk(id, {
            attributes: ['username', 'email', 'phone', 'address', 'dateBirthday', 'gender'],
            include: [
                {
                    model: TourRequests,
                    as: 'userTourRequests',
                    attributes: ['status'],
                    include: [
                        {
                            model: TourChild,
                            as: 'tourRequestsChild',
                            attributes: ['start_date', 'tour_code'],
                            include: [
                                {
                                    model: Tour,
                                    as: 'tour',
                                    attributes: ['name']
                                }
                            ] 
                        }
                    ]
                },
            ]
        })
        res.status(200).json({ success: true, data:request });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' });
    }
}
