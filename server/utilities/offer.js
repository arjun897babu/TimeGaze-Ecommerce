const mongoose = require('mongoose');
const Offer = require('../model/offerSchema')

exports.allOffer = async()=>{
return await Offer.aggregate([{$match:{}}])
}