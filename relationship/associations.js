import Tour from "../models/Tour.js";
import TourChild from '../models/TourChild.js';
import TourLocation from "../models/TourLocation.js";
import Location from "../models/Location.js";
import TourImage from "../models/TourImage.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Passenger from "../models/Passenger.js";
import Category from "../models/Category.js";
import News from "../models/News.js";
import Review from "../models/Review.js";


// Relationship one to many between Tour and TourChild
Tour.hasMany(TourChild, { foreignKey: 'tour_id', as: 'tourChildren' });
TourChild.belongsTo(Tour, { foreignKey: 'tour_id', as: 'tour' });


// The relationship of the three tables Tour, Location and TourLoation
Tour.belongsToMany(Location, { through: TourLocation, foreignKey: 'tour_id', as: 'locations' });
Location.belongsToMany(Tour, { through: TourLocation, foreignKey: 'location_id', as: 'tours' });
TourLocation.belongsTo(Tour, { foreignKey: 'tour_id', as: 'tour' });
TourLocation.belongsTo(Location, { foreignKey: 'location_id', as: 'location' });

// Relationship one to many between Tour and TourImage
Tour.hasMany(TourImage, {foreignKey: 'tour_id', as: 'tourImage'})
TourImage.belongsTo(Tour, {foreignKey: 'tour_id', as: 'tour'})

// Relationship users, booking, tour_child, passenger
User.hasMany(Booking, {foreignKey: 'user_id', as: 'userBooking'})
TourChild.hasMany(Booking, {foreignKey: 'tour_child_id', as: 'tourChildBooking'})

Booking.belongsTo(User, {foreignKey: 'user_id', as: 'bookingUser'})
Booking.belongsTo(TourChild, {foreignKey: 'tour_child_id', as: 'bookingTourChild'})

Booking.hasMany(Passenger, {foreignKey: 'booking_id', as: 'bookingPassenger'})
Passenger.belongsTo(Booking, {foreignKey: 'booking_id', as: 'passengerBooking'})

// Relationship categories, news
Category.hasMany(News, {foreignKey: 'cate_id', as: 'cateNews'})
News.belongsTo(Category, {foreignKey: 'cate_id', as: 'newsCate'})

// Relationship review user and tour
User.hasMany(Review, {foreignKey: 'user_id', as: 'userReviews'})
Review.belongsTo(User, {foreignKey: 'user_id', as: 'reviewsUser'})

Tour.hasMany(Review, {foreignKey: 'tour_id', as: 'tourReviews'})
Review.belongsTo(Tour, {foreignKey: 'tour_id', as: 'reviewsTour'})