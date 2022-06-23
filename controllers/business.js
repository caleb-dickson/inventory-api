import { Business } from "../models/business.js";

import { Location } from "../models/location.js";

import { User } from "../models/user.js";

// CREATE NEW BUSINESS
export const createBusiness = async (req, res, next) => {
  let imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/business/" + req.file.filename;
  }

  try {
    // DEFINE THE NEW BUSINESS
    const business = new Business({
      businessName: req.body.businessName,
      ownerId: req.body.ownerId,
      businessPhoto: imagePath,
      locations: [],
    });

    try {
      // CUSTOM "UNIQUE BUSINESS" VALIDATOR. EACH OWNER ACCOUNT ONLY
      // HAS ONE BUSINESS PER ACCOUNT
      // THE BUSINESS IS THE CONTAINER AND MANAGER FOR MOST APP OPERATIONS
      const checkOnlyOwnersBusiness = await Business.findOne({
        ownerId: req.body.ownerId,
      });

      if (checkOnlyOwnersBusiness) {
        // IF THE USER ALREADY HAS A BUSINESS, RETURN ERROR 422
        res.status(422).json({
          message:
            "Invalid submit. If you're sure this is an error, please contact tech support via the navigation panel.",
        });
      }
    } catch (error) {
      if (!res.headersSent) {
        res.status(500).json({
          message: error,
        });
      }
    }

    // IF NO EXISTING BUSINESS WAS FOUND, SAVE THE DEFINED BUSINESS
    const newBusiness = await business.save();

    // PULL THE USER (OWNER) DOC FROM DB
    const ownerUser = await User.findById(req.body.ownerId);

    // ADD THE NEW BUSINESS TO THE USERPROFILE
    const updatedOwner = await ownerUser.ownerAddBusiness(newBusiness);

    // SEND BACK THE DATA TO THE CLIENT
    res.status(201).json({
      message: "Business created successfully",
      business: {
        ...newBusiness._doc,
      },
      businessId: newBusiness._id,
      updatedUser: updatedOwner,
      updatedUserId: updatedOwner._id,
    });
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        message: error._message,
      });
    }
  }
};
// CREATE NEW BUSINESS /// END

// FETCH OWNER'S BUSINESS AND POPULATE ALL LOCATIONS ASSOCIATED
export const getOwnersBusiness = async (req, res, next) => {
  try {
    const foundBusiness = await Business.findOne({
      ownerId: req.params.ownerId,
    }).populate({
      path: "locations.location",
      populate: { path: "managers.manager" },
      model: "Location",
    });

    if (foundBusiness && foundBusiness._id) {
      res.status(200).json({
        message: "Owner's business found.",
        business: foundBusiness,
        businessId: foundBusiness._id,
      });
    }
    if (!foundBusiness) {
      res.status(404).json({
        message: "Owner has no business yet.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error._message,
    });
  }
};
// FETCH OWNER'S BUSINESS AND POPULATE ALL LOCATIONS ASSOCIATED /// END

// EDIT/UPDATE BUSINESS (businessName)
export const updateBusiness = async (req, res, next) => {
  let imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/business/" + req.file.filename;
  }

  try {
    let business = await Business.findByIdAndUpdate(
      req.body.businessId,
      {
        businessName: req.body.businessName,
        businessPhoto: imagePath,
      },
      { new: true }
    );

    business = await Business.findById(req.body.businessId).populate({
      path: "locations.location",
      model: "Location",
    });


    res.status(200).json({
      message: "Business name updated successfully",
      updatedBusiness: business,
      updatedBusinessId: business._id
    });
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        message: error,
      });
    }
  }
};
// EDIT/UPDATE BUSINESS (businessName) /// END

// CREATE NEW LOCATION
export const createLocation = async (req, res, next) => {

  try {
    // DEFINE THE NEW LOCATION
    const newLocation = new Location({
      locationName: req.body.locationName,
      parentBusiness: req.body.parentBusiness,
      inventoryData: [],
    });

    // SAVE NEW LOCATION TO THE DB
    const savedLocation = await newLocation.save();

    // RETRIEVE THE PARENT BUSINESS DOC
    const parentBusiness = await Business.findById(req.body.parentBusiness);

    // PULL ALL LOCATIONS INTO THE PARENT BUSINESS IN DB
    await parentBusiness.addLocationToBusiness(savedLocation._id);

    const updatedBusiness = await parentBusiness.populate({
      path: "locations.location",
      model: "Location",
    });

    res.status(201).json({
      message: "Location created successfully",
      location: {
        createdLoc: savedLocation._doc,
        id: savedLocation._id,
      },
      updatedBusiness: {
        business: updatedBusiness._doc,
        id: updatedBusiness._id,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error._message,
    });
  }
};
// CREATE NEW LOCATION /// END

// EDIT/UPDATE LOCATION (locationName)
export const updateLocation = async (req, res, next) => {

  try {
    const foundLocation = await Location.findById(
      req.body.locationUpdateData._id
    );

    const updatedLocation = await foundLocation.updateLocation(
      req.body.locationUpdateData
    );


    res.status(200).json({
      message: "Location name updated successfully",
    });
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        message: error._message,
      });
    }
  }
};
// EDIT/UPDATE LOCATION (locationName) /// END

export const addUsersToLocation = async (req, res, next) => {

  try {
    const locationForAdd = await Location.findById(req.body.location);

    // FOR managers
    if (req.body.role === "manager") {
      const updatedLocation = await locationForAdd.addManagers(req.body.emails);

      if (updatedLocation === "Not found.") {
        res.status(404).json({
          message:
            "Couldn't find a manager. Are all users signed up as Manager?",
        });
      } else {
        res.status(200).json({
          message: "Manager was found and added to the location.",
          businessId: locationForAdd.parentBusiness,
        });
      }

      // FOR staff
    } else if (req.body.role === "staff") {
      const updatedLocation = await locationForAdd.addStaff(req.body.emails);

      if (updatedLocation === "Not found.") {
        res.status(404).json({
          message:
            "Couldn't find a staff member. Are all users signed up as Staff?",
        });
      } else {
        res.status(200).json({
          message: "Staff member was found and added to the location.",
          businessId: locationForAdd.parentBusiness,
        });
      }
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        message: error,
      });
    }
  }
};

export const getBusinessLocations = async (req, res, next) => {

  try {

    const bizLocations = await Location.find({
      parentBusiness: req.params.businessId,
    })
      .populate({
        path: "managers.manager",
        model: "User",
      })
      .populate({
        path: "staff.staffMember",
        model: "User",
      })
      .populate({
        path: "productList.product",
        model: "Product",
      })
      .populate({
        path: "inventoryData.inventory",
        model: "Inventory",
      });

    if (bizLocations) {
      res.status(200).json({ fetchedLocations: bizLocations });
    }
    if (!bizLocations) {
      res.status(404).json({ message: "No locations were found" });
    }
  } catch (error) {
    res.status(500).json({
      message: error._message,
    });
  }
};
