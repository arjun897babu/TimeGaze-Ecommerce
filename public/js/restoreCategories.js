$(document).ready(function(){
  $('.restore_button').click(function(){
    const categoryId = $(this).attr('data-id');
    restore(categoryId);
  }); 

  function restore(categoryId){
    console.log(categoryId)
    $.ajax({
      url:`http://localhost:3000/api/restoreCategory/${categoryId}`,
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