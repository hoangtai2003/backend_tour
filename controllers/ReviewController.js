import Tour from "../models/Tour.js"
import Review from "../models/Review.js"
import User from "../models/User.js"
import Booking from "../models/Booking.js";

export const createReview = async (req, res) => {
    const { user_id, tour_id, review_comment, review_rating, booking_id } = req.body;
    try {
        const tour = await Tour.findByPk(tour_id);
        const user = await User.findByPk(user_id);
        const booking = await Booking.findByPk(booking_id)
        if (!tour || !user) {
            return res.status(404).json({
                success: false,
                message: 'Tour hoặc người dùng không tồn tại',
            });
        }
        const existingReview = await Review.findOne({
            where: { user_id, tour_id, booking_id }
        });
        if (existingReview) {
            return res.status(400).json({
                success: false,
               message: 'Bạn đã đánh giá tour này rồi cho lần đặt chỗ này.'
            });
        }
        const newReview = await Review.create({
            user_id,
            tour_id,
            review_comment,
            review_rating,
            booking_id
        });

        res.status(200).json({
            success: true,
            message: "Đánh giá thành công!",
            data: newReview
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi gửi đánh giá"
        });
    }
};


export const getReviewBySlugTour = async(req, res) => {
    const { slug } = req.params
    try {
        const review = await Tour.findOne({
            where: {
                tour_slug: slug
            },
            include: [
                {
                    model: Review,
                    as: 'tourReviews',
                    attributes: ['review_comment', 'review_rating', 'review_date'],
                    include: [
                        {
                            model: User,
                            as: 'reviewsUser',
                            attributes: ['username', 'user_image']
                        }
                    ]
                }
            ]
        })
        res.status(200).json({success: true, message:"", data: review})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message:"Có lỗi xảy ra. Vui lòng thử lại!"})
    }
}

export const getAllReview = async (req, res) => {
    try {
        const review = await Review.findAll({
            include: [
                {
                    model: User,
                    as: 'reviewsUser',
                    attributes: ['username', 'email', 'user_image']
                }
            ]
        })
        res.status(200).json({success: true, message:"", data: review})
    } catch (error) {
        res.status(500).json({success: false, message:"Có lỗi xảy ra. Vui lòng thử lại!"})
    }
}

export const editStatus = async(req, res) => {
    const { id } = req.params
    const { status } = req.body
    try {
        const review = await Review.findByPk(id)

        await review.update({ status });
        res.status(200).json({ success: true, message: 'Cập nhật thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, error, message: 'Có lỗi xảy ra. Vui lòng thử lại !' });
    }
}