const mongoose = require('mongoose');
const Address = require('../model/addressSchema');
const User = require('../model/userModelSchema');
const address = require('../model/addressSchema');
const axios = require('axios')

exports.createAdress = async (req, res, next) => {

  try {
    const { name, mobileNumber, district, pincode, locality, address, state, addressType } = req.body;

    const userEmail = req.session.email;
    const { source } = req.query


    if (!name || !mobileNumber || !district || !pincode || !locality || !address || !state || !addressType) {
      return res.send('all fields are required')
    }

    if (!userEmail) return res.status(401).redirect('/login')

    const existingUser = await User.findOne({ email: userEmail });




    if (existingUser.adress) {
      const adresslength = await Address.aggregate(
        [
          {
            $match: { _id: existingUser.adress._id }
          },
          { $unwind: '$address' }
        ]
      );

      const existingAddressDocument = await Address.findById(existingUser.adress._id);

      if (adresslength.length < 1) {
        const newNestedAdress =
        {
          ...req.body,
          defaultAdress: true,
        }


        existingAddressDocument.address.push(newNestedAdress);
        await existingAddressDocument.save();
        if (source === 'checkout') {
          res.status(200).redirect('/checkout')
        } else {
          res.status(200).redirect('/address')
        }
      } else {

        const newAdressData = { ...req.body };
        existingAddressDocument.address.push(newAdressData);
        await existingAddressDocument.save();
        if (source === 'checkout') {
          res.status(200).redirect('/checkout')
        } else {
          res.status(200).redirect('/address')
        }
      }
    }

    else {

      const newNestedAdress = new Address(
        {
          address: [
            {
              ...req.body,
              defaultAdress: true,
            }
          ]
        }
      );

      const addedNewAddress = await newNestedAdress.save();
      req.session.addressId=addedNewAddress._id;
      existingUser.adress = addedNewAddress._id;
      await existingUser.save();
      if (source === 'checkout') {
        res.status(200).redirect('/checkout')
      } else {
        res.status(200).redirect('/address')
      }

    }

  }
  catch (error) {
    next(error)

  }
}

exports.getAllAdress = async (req, res, next) => {


  try {

    const {userEmail} = req.query

    const user = await User.findOne({ email: userEmail }, { _id: 0, adress: 1 });
    const {data} = await axios.post(`https://countriesnow.space/api/v0.1/countries/states`, {
      country: 'India'
    });

    const allStates = data.data.states;

    if (user.adress) {

      const allAddress = await Address.aggregate(
        [
          {
            $match:
              { _id: user.adress._id }
          },
          { $unwind: '$address' }
        ]
      );

      res.status(200).json({ address: allAddress, allStates: allStates })
    } else {
      return res.send(null)
    }



  }
  catch (error) {
    next(error)
  }
}


exports.deleteAddress = async (req, res,next) => {
  try {

    const { addressId } = req.params;
    const { selectedId } = req.body;
    if (!addressId || !selectedId) {
      return res.send('all fields are required');
    }

    //delete the selected address 
    const deleteAddress = await Address.findByIdAndUpdate(
      addressId,
      {
        $pull:
        {
          'address':
          {
            _id: selectedId
          }
        }
      },
      {
        new: true
      }
    );

    if (deleteAddress) {
      //find all the address in the user document
      const existingAddressDocument = await Address.aggregate(
        [
          {
            $match: { _id: new mongoose.Types.ObjectId(addressId) }
          },
          {
            $unwind: '$address'
          }
        ]
      );

      //check is there default address or not
      const isDefault = existingAddressDocument.every(element => !element.address.defaultAdress)
      //change the default address 
      if (isDefault && existingAddressDocument.length > 0) {
        await Address.findOneAndUpdate(
          {
            "_id": addressId
          },
          {
            $set: { 'address.0.defaultAdress': true }
          },
          {
            new: true
          }
        );

        res.send('document deleted and default address changed');
      } else {

        res.send('document deleted defualt addrest ')
      }
    }

  } catch (error) {
    next(error)
  }
}

//to get a single address details
exports.editAddress = async (req, res) => {

  const selectedId = req.query.selected;
  const { addressId } = req.params;
  if (!selectedId || !addressId) return res.send('not found or not logged in ');
  const trueAddress = await Address.aggregate(
    [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(addressId)
        }
      },
      { $unwind: '$address' },
      {
        $match: {
          'address._id': new mongoose.Types.ObjectId(selectedId)
        }
      }
    ]
  );
  if (trueAddress) {
    res.send(trueAddress);
  } else {
    res.send('not found');
  }

}

// update a address
exports.updateAddress = async (req, res,next) => {
  try {

    const newData = { ...req.body };
    const { selected } = req.params;
    const { source } = req.query
    const addressId = req.session.addressId;
    if (!selected || !source || !newData) return res.status().send('Field is required')

    const existing = await Address.findOne(
      { _id: addressId },
      { 'address': { $elemMatch: { _id: selected } } }
    );

    if (existing.address.length > 0) {
      const updatedDocument = await Address.findByIdAndUpdate(
        addressId,
        {
          $set: {
            'address.$[elem].name': newData.name,
            'address.$[elem].mobileNumber': newData.mobileNumber,
            'address.$[elem].district': newData.district,
            'address.$[elem].pincode': newData.pincode,
            'address.$[elem].locality': newData.locality,
            'address.$[elem].address': newData.address,
            'address.$[elem].state': newData.state,
            'address.$[elem].addressType': newData.addressType,
          }
        },
        { new: true, arrayFilters: [{ 'elem._id': selected }] }
      );

      if (updatedDocument) {
        if (source === 'address') {
          res.status(200).json({
            message: 'Updated',
            redirectUrl: '/address'
          });
        } else if (source === 'checkout') {
          res.status(200).json({
            message: 'Updated',
            redirectUrl: '/checkout'
          });
        }
      }
    } else {
      res.status(400).send('not found')
    }
  } catch (error) {
    next(error)
  }
};


exports.makeDefault = async (req, res, next) => {
  try {
    const { selectedId } = req.params;
    const addressId = req.session.addressId;

    if (!selectedId || !addressId) {
      return res.status(400).send('Missing parameter');
    }

    const existingAddressDocument = await Address.findById(
      addressId,
      { 'address._id': 1, 'address.defaultAdress': 1 }
    );



    const selectedIndex = existingAddressDocument.address.findIndex(item => item._id.equals(selectedId));

    if (selectedIndex === -1) {
      let error = new Error('Item not found');
      error.status = 404;
      return next(error);
    }

    existingAddressDocument.address.forEach((item, index) => item.defaultAdress = (index === selectedIndex));

    await existingAddressDocument.save();

    res.send('working');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}
