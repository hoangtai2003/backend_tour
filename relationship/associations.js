import Tour from "../models/Tour.js";
import TourChild from '../models/TourChild.js';

Tour.hasMany(TourChild, { foreignKey: 'tour_id', as: 'tourChildren' });
TourChild.belongsTo(Tour, { foreignKey: 'tour_id', as: 'tour' });
