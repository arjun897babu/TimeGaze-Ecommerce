$(document).ready(function(){
  $('.restore_product').click(function(){
    const productId = $(this).attr('data-id');
    restore(productId);
  }); 

  function restore(productId){
    $.ajax({
      url:`/api/restoreProduct/${productId}`,
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