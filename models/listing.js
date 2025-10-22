const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
    filename: {
        type: String,
        default: "listingimage"
    },
    url: {
        type: String,
        default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        set: (v) =>
            v === ""
                ? "https://unsplash.com/photos/snowy-mountain-illuminated-by-sunlight-Qn6AAIVkLww"
                : v
    }
}
,
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;
