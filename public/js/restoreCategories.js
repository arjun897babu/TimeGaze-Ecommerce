$(document).ready(function(){
  $('.restore_button').click(function(){
    const categoryId = $(this).attr('data-id');
    restore(categoryId);
  }); 

  function restore(categoryId){
    $.ajax({
      url:`/api/restoreCategory/${categoryId}`,
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