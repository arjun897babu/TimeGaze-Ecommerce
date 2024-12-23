const mongoose = require('mongoose');
const Category = require('../model/categorySchema');
const queryString = require('querystring');

exports.allCategory = async () => {
  try {

    return await Category.aggregate(
      [
        { $match: { unlisted: false } },
        {
          $project: {
            _id: 1,
            categoryName: 1
          }
        }
      ]
    )
  }
  catch (error) {
    throw error
  }
}


exports.categoriesWithPagination = async (req) => {
  try {
    let { pageNumber, search = '' } = req.query;

    if (!req.query.hasOwnProperty('pageNumber') || req.query.pageNumber === '' || req.query.pageNumber < 1) {
      req.query.pageNumber = 1;
      pageNumber = 1
    }

    pageNumber = parseInt(pageNumber, 10);
    const perpage = 1

    if (isNaN(pageNumber) || pageNumber < 1) {
      pageNumber = 1;
    }
    const startIndex = (pageNumber - 1) * perpage;
    const endIndex = pageNumber * perpage;
    let matchQuery = {};
    let selected = {}
    if (search.trim() !== '') {
      matchQuery.categoryName = { $regex: `^${search.trim()}`, $options: 'i' };
      selected.search = search.trim()
    }
    const aggregationPipeline = [
      { $match: { unlisted: false, ...matchQuery } },
      {
        $project: {
          _id: 1,
          categoryName: 1
        }
      },

    ];

    const categories = await Category.aggregate([...aggregationPipeline, { $skip: startIndex }, { $limit: perpage }]);

    const [count] = await Category.aggregate([...aggregationPipeline, { $count: 'totalCount' }]);
    const totalPages = Math.ceil((count?.totalCount || 0) / perpage);
    const path = queryString.stringify(req.query);
    return {
      categories,
      totalPages: {
        totalPages,
        path,
        startIndex,
        endIndex,
        pageNumber
      },
      selected
    }
  } catch (error) {
    throw error
  }


}