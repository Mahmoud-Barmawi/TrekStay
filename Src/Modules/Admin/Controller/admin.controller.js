import { isAccommodationAlreadyExist } from "../../../Utils/helper_functions.js";

export const confirmAccommodationPublished = async (req, res, next) => {
    const {id}=req.params;
    const {answer}=req.body;
    let accommodation = await isAccommodationAlreadyExist(id);
    if (!accommodation)
        return next(new Error('The specified accommodation is non-existent'));
    if(accommodation.published=='Accepted' || accommodation.published == 'Rejected') 
        return next (new Error('The query regarding this accommodation has been addressed'));
    accommodation.published=answer;
    await accommodation.save();
    return res.json({message:"success",accommodation});
}
