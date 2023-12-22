$(document).ready(function(){
  $('.delete_button').click(function(){
    const categoryId = $(this).attr('data-id');
    softDelete(categoryId);
  }); 

  function softDelete(categoryId){
    console.log(categoryId)
    $.ajax({
      url:`http://localhost:3000/api/deleteCategory/${categoryId}`,
      type:'PUT',
      contentType:'application/json',
      success: function(data){
        location.reload()
      },
      error:function(error){
        console.error(error.message)
      }
    })
  }
})