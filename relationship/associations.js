import Tour from "../models/Tour.js";
import TourChild from '../models/TourChild.js';
import TourLocation from "../models/TourLocation.js";
import Location from "../models/Location.js";
import TourImage from "../models/TourImage.js";


// Relationship one to many between Tour and TourChild
Tour.hasMany(TourChild, { foreignKey: 'tour_id', as: 'tourChildren' });
TourChild.belongsTo(Tour, { foreignKey: 'tour_id', as: 'tour' });


// The relationship of the three tables Tour, Location and TourLoation
Tour.hasMany(TourLocation, { foreignKey: 'tour_id', as: 'tourLocations' });
Location.hasMany(TourLocation, { foreignKey: 'location_id', as: 'tourLocations' });
TourLocation.belongsTo(Tour, { foreignKey: 'tour_id', as: 'tour' });
TourLocation.belongsTo(Location, { foreignKey: 'location_id', as: 'location' });

// Relationship one to many between Tour and TourImage
Tour.hasMany(TourImage, {foreignKey: 'tour_id', as: 'tourImage'})
TourImage.belongsTo(Tour, {foreignKey: 'tour_id', as: 'tour'})