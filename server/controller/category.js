const category = require('../model/categorySchema');


//to add categories
exports.addCategory = async (req, res,next) => {
  try {
    const { name } = req.body;

    if (!name) {
      req.session.errorMessage = 'All fields required'
      return res.redirect('/addCategory');
    }
    const existingCateogry = await category.findOne({ categoryName: name });

    if (existingCateogry) {
      req.session.errorMessage = 'category exists'
      return res.redirect('/addCategory');
    }
    const newCategory = new category({
      categoryName: name
    });

    const saved = await newCategory.save();
    console.log(saved);

    res.status(200).redirect('/adminCategory')



  } catch (error) {
   next(error)
  }
}

//find all category
exports.findAllCategory = async (req, res,next) => {
  try {
    const Category = await category.find({ unlisted: false });
    // console.log(Category);
    if (!Category) {
      res.send('no categories');

    } else {
      res.send(Category)
    }

  } catch (error) {
    next(error)
    // res.status(500).send(error.message);
  }
};

//unlisted category
exports.findUnlistedCategory = async (req, res,next) => {
  try {
    const Category = await category.find({ unlisted: true });
    console.log(Category);
    if (!Category) {
      res.send('no categories');

    } else {
      res.send(Category)
    }

  } catch (error) {
    next(error)
  }
}


//delete category

exports.deleteCategory = async (req, res,next) => {
  try {
    const { categoryId } = req.params;

    const existingCateogry = await category.findByIdAndUpdate(categoryId, { unlisted: true }, { new: true });

    if (existingCateogry) {
      console.log(existingCateogry);
      res.status(200).send('delted')

    } else {
      res.status(400).send('not found')
    }


  }
  catch (error) {
    res.send(error.message)
  }
}

//resote category
exports.restoreCategory = async (req, res,next) => {
  try {
    const { categoryId } = req.params;

    const existingCateogry = await category.findByIdAndUpdate(categoryId, { unlisted: false }, { new: true });

    if (existingCateogry) {
      res.status(200).send('resored')

    } else {
      res.status(400).send('not found')
    }

  }
  catch (error) {
    res.send(error.message)
  }
}


//single category page

exports.singleCategory = async (req, res,next) => {

  try {
    const { categoryId } = req.query;
    if (!categoryId) {
      return res.status(400).redirect('/adminCategory')
    }

    const existingCategory = await category.findOne({ _id: categoryId });

    if (!existingCategory) {
      res.status(400).redirect('/adminCategory')
    } else {
      res.send(existingCategory)
    }
  }
  catch (error) {
    res.status(500).send(error.message)
  }

}

//update Category

exports.updateCategory = async (req, res) => {

  try {
    const { categoryId } = req.params;
    const { name } = req.body;
    console.log(req.params,req.body);
    if (!categoryId || !name) {
      return res.send('all required')
    }
    const existingCategoryName = await category.findOne({ categoryName: name });
    console.log(existingCategoryName);
    if (existingCategoryName) {

       res.status(400).send('already exist')

    } else {

      const existingCategory = await category.findByIdAndUpdate(categoryId, { categoryName: name }, { new: true });

      if (!existingCategory) {
        res.send('category is not found')
      } else {
        res.status(200).send(existingCategory);
      }
    }
  }
  catch (error) {
    console.log(error.message)
    res.status(500).send(error.message)
  }


}


