import visaModel from "../../../../Database/Models/visa_card.model.js";

export const fillVisaDetails = async (req, res, next) => {
    const { cardNumber, cardPassword, amountOfMoney } = req.body;
    const checkUserVisa = await visaModel.findOne({ userId: req.user._id });
    if (!checkUserVisa) {
        const dillDetails = await visaModel.create({
            userId: req.user._id,
            cardNumber,
            cardPassword,
            amountOfMoney,
        })
        return res.json({ message: "success", dillDetails });
    }
    return res.json({ message: "You have already filled in your visa card information" });

}