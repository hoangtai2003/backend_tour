import Tour from "../models/Tour.js"
import User from "../models/User.js";
import News from "../models/News.js"
import Booking from "../models/Booking.js";
import { Sequelize } from "sequelize";
import TourChild from "../models/TourChild.js";

export const statisticalTour = async(req, res) => {
    try {
        const totalTour = await Tour.count()
        const totalUser = await User.count()
        const totalNews = await News.count()
        const revenueDay = await Booking.findOne({
            attributes: [
                [Sequelize.fn("SUM", Sequelize.col("total_price")), 'total_price']
            ],
            raw: true,
            where: {
                status: "Đã thanh toán",
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('DATE', Sequelize.col('booking_date')), Sequelize.fn('CURDATE')),
                ]
            }

        })
        const revenueMonth = await Booking.findOne({
            attributes: [
                [Sequelize.fn("SUM", Sequelize.col("total_price")), 'total_price']
            ],
            raw: true,
            where: {
                status: "Đã thanh toán",
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('booking_date')), new Date().getMonth() + 1),
                ]
            }

        })
        const revenueYear = await Booking.findOne({
            attributes: [
                [Sequelize.fn("SUM", Sequelize.col("total_price")), 'total_price']
            ],
            raw: true,
            where: {
                status: "Đã thanh toán",
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('booking_date')), new Date().getFullYear())
                ]
            }

        })
        const totalTourConfirm = await Booking.count({
            where: {
                status: "Đã thanh toán"
            }
        })

        const totalTourRegister = await Booking.findAll({
            attributes: [
                'bookingTourChild.tour_id',
                'bookingTourChild.tour.name',
                'bookingTourChild.tour.program_code',
                [Sequelize.fn("COUNT", Sequelize.col("booking.id")), 'count']
            ],
            include: [
                {
                    model: TourChild,
                    as: 'bookingTourChild',
                    include: [
                        {
                            model: Tour,
                            as: 'tour'
                        }
                    ]
                }
            ],
            where: {
                status: "Chờ xác nhận"
            },
            group: ['bookingTourChild.tour_id'],
            raw: true
        })

        res.status(200).json({
            success: true,
            message: "!",
            data: {totalTour, totalUser, totalNews, totalTourConfirm, revenueDay, revenueMonth, revenueYear, totalTourRegister}
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra. Hãy thử lại !"
        });
    }
}

export const statisticalChart = async(req, res) => {
    try {
        const { month, year } = req.query
        const chartLine = await Booking.findAll({
            attributes: [
                [Sequelize.fn("DATE", Sequelize.col("booking_date")), 'booking_day'],
                [Sequelize.fn('SUM', Sequelize.col('number_of_adults')), 'total_adults'],
                [Sequelize.fn('SUM', Sequelize.col('number_of_children')), 'total_children'],
                [Sequelize.fn('SUM', Sequelize.col('number_of_toddler')), 'total_toddler'],
                [Sequelize.fn('SUM', Sequelize.col('number_of_baby')), 'total_baby'],
            ],
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('booking_date')), month),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('booking_date')), year),
                    { status: "Đã thanh toán" }
                ],
            },
            group: [Sequelize.fn('DATE', Sequelize.col('booking_date'))],
            order: [[Sequelize.fn('DATE', Sequelize.col('booking_date')), 'ASC']],
            raw: true
        })

        const chartPieConfirm = await Booking.count({
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('booking_date')), month),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('booking_date')), year),
                    { status: "Đã thanh toán" }
                ],
            },
        })
        const chartPiePending = await Booking.count({
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('booking_date')), month),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('booking_date')), year),
                    { status: "Chờ xác nhận" }
                ],
            },
        })
        const chartPieCancel = await Booking.count({
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('booking_date')), month),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('booking_date')), year),
                    { status: "Hủy bỏ" }
                ],
            },
        })

        const chartLineRevenue = await Booking.findAll({
            attributes: [
                [Sequelize.fn("DATE", Sequelize.col("booking_date")), 'booking_day'],
                [Sequelize.fn('SUM', Sequelize.col('total_price')), 'total_price'],
            ],
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('booking_date')), month),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('booking_date')), year),
                    {status: "Đã thanh toán"}
                ]
            },
            group: [Sequelize.fn('DATE', Sequelize.col('booking_date'))],
            order: [[Sequelize.fn('DATE', Sequelize.col('booking_date')), 'ASC']],
            raw: true
        })
        res.status(200).json({
            success: true,
            message: "!",
            data: {chartLine, chartPieConfirm, chartPiePending, chartPieCancel, chartLineRevenue }
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Something went wrong!' });
    }
} 
