const mongoose = require('mongoose');
const Address = require('../model/addressSchema');
const User = require('../model/userModelSchema');

exports.createAdress = async (req, res) => {

  try {
    const { name, mobileNumber, district, pincode, locality, address, state, addressType } = req.body;

    const userEmail = req.session.email ;


    if (!name || !mobileNumber || !district || !pincode || !locality || !address || !state || !addressType) {
      return res.send('all fields are required')
    }

    if (!userEmail) return res.status(400).send('no email is found')

    const existingUser = await User.findOne({ email: userEmail });

    if (!existingUser) {
      return res.status(400).send('no user exist');//no user exis
    }
    else {

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

          // const existingAddressDocument = await Address.findById(existingUser.adress._id);
          existingAddressDocument.address.push(newNestedAdress);
          await existingAddressDocument.save();
          res.status(200).redirect('/address')
        } else {
          // const existingAddressDocument = await Address.findById(existingUser.adress._id);
          const newAdressData = { ...req.body };
          existingAddressDocument.address.push(newAdressData);
          await existingAddressDocument.save();
          res.status(200).redirect('/address');
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

        existingUser.adress = addedNewAddress._id;
        await existingUser.save();
        console.log(newNestedAdress)
        res.send('new adress added to collection address 1st time' + newNestedAdress);

      }
    }
  }
  catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
}

exports.getAllAdress = async (req, res) => {


  try {
    console.log('calling  api',req.query.userEmail )
    const userEmail = req.query.userEmail ;

    if (!userEmail) {
      return res.send('user not logged in ')
    }
    const user = await User.findOne({ email: userEmail }, { _id: 0, adress: 1 });

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

      console.log('user all Adress', allAddress);
      res.send(allAddress)
    } else {
      return res.send(null)
    }



  }
  catch (error) {
    res.status(500).send(error.message)
  }
}


exports.deleteAddress = async (req, res) => {
  try {

    const { addressId } = req.params;
    const { selectedId } = req.body;

    console.log(addressId,selectedId)

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
        console.log(existingAddressDocument.length)

      //change the default address 
      if (isDefault&&existingAddressDocument.length>0) {
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
    console.log(error)
    res.send(error.message)
  }
}