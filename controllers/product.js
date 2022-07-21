import { Location } from "../models/location.js";

// REMOVES PRODUCTS FROM LOCATION LIST
// KEEPS THE PRODUCT DOC FOR PAST INVENTORIES
// PRODUCT STILL HAS RELATION TO THE LOCATION
export const deleteProduct = async (req, res, next) => {
    const productIds = req.body.productIds;
    const locationId = req.body.locationId;
    let locationAfter;

    try {

        const locationBefore = await Location.findById(locationId);
        const prodListBefore = locationBefore.productList.length;

        if (productIds.length === 1) {
            locationAfter = await locationBefore.removeProductFromList(productIds[0]);

        } else if (productIds.length > 1) {

            for (const id of productIds) {
                locationAfter = await locationBefore.removeProductFromList(id);
            }
        }

        const prodListAfter = locationAfter.productList.length;

        if (prodListBefore > prodListAfter) {
            res.status(200).json(
                {
                    message: productIds.length +
                        ' products were submitted. ' +
                        (prodListBefore - prodListAfter) +
                        ' were deleted.'
                });
        } else {
            res.status(404).json(
                {
                    message: (prodListAfter - prodListBefore) + ' products were deleted.'
                }
            )
        }

    } catch (error) {
        console.log(error);
        if (!res.headersSent) {
            return res.status(500).json({
                message: error,
            });
        }
    }


}
