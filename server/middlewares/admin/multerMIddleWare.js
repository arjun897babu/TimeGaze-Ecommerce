const multer = require('multer');
const path = require('path');

//setting the storage
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, 'public/uploads');
  },
  filename: (req, file, callBack) => {
    callBack(null, Date.now() + "_" + path.extname(file.originalname));
  }
})




exports.upload = multer({ storage: storage});


