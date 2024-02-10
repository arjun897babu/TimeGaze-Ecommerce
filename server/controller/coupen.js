const mongoose = require('mongoose');
const Coupen = require('../model/coupenSchema');
const Order = require('../model/orderSchema');
const coupenHelper = require('../utilities/coupen');
const offerHelper = require('../utilities/offer')


exports.CreateCoupen = async (req, res, next) => {

  try {
    const { code, isPercentage, maxDiscount, discount, expiry, minAmount, limit } = req.body;

    if (!code || !discount || !expiry || !minAmount || !limit) {
      return res.status(400).json(
        {
          status: 'failed',
          message: 'All fields are required'
        }
      );
    }

    const existingCoupen = await Coupen.exists({ code: code });
    if (existingCoupen) {
      return res.status(409).json(
        {
          status: 'failed',
          message: 'coupen exists'
        }
      )
    }

    const newCoupen = new Coupen({
      code: code,
      isPercentage: isPercentage ? true : false,
      maxDiscount: maxDiscount ? maxDiscount : null,
      discount: discount,
      expiry: expiry,
      minAmount: minAmount,
      limit: limit ? limit : null
    });

    await newCoupen.save();

    res.status(200).json(
      {
        status: 'success',
        message: "coupen created successfully"
      }
    )

  } catch (error) {
    next(error)
  }

}

exports.applyCoupen = async (req, res, next) => {
  try {
    const userId = req.session.userId
    const { code } = req.body;

    const [availableCoupen] = await Coupen.aggregate(
      [
        {
          $match: {
            code: code,
            active: true
          }
        }
      ]
    )

    if (!availableCoupen) return res.status(400).json(
      {
        status: 'error',
        message: 'Invalid Coupon'
      }
    )
    if (availableCoupen.expiry < Date.now()) return res.status(400).json(
      {
        status: 'error',
        message: 'Coupon expired'
      }
    )

    const lastPrice = await offerHelper.calulateLastPrice(userId);

    if (lastPrice < availableCoupen.minAmount) return res.status(400).json(
      {
        status: 'error',
        message: `purchase above ${availableCoupen.minAmount}`
      }
    )

    const [appliedCoupon] = await Order.aggregate(
      [
        {
          $match:
          {
            coupon: code
          }
        },
        {
          $group: {
            _id: "$coupon",
            usedCount: { $sum: 1 }
          }
        }

      ]
    );

    if (!appliedCoupon || appliedCoupon.usedCount < availableCoupen.limit) {
      //calculated discount amount

      const discountPrice = coupenHelper.calculateDiscount(availableCoupen, lastPrice);
      req.session.coupon = availableCoupen
      res.status(200).json(
        {
          status: 'success',
          discountPrice: discountPrice,
          discount: lastPrice - discountPrice,
          message: "coupon applied successfully"
        }
      );
    }
    else {
      res.status(400).json({
        status: 'error',
        message: 'Coupon Expired'
      })
    }


  } catch (error) {
    next(error)
  }
}

