
$(document).ready(function () {
  const baseURL = window.location.protocol + '//' + window.location.host
  
  $(".bi-pencil-fill").click(function () {
    console.log('working');
    let container = $(this).closest('.position-relative');
    console.log(container)
    container.find('.option-button').show()
    $(this).hide();
    
    let inputField = container.find('.oldValue').css('cursor','auto');;
    inputField.data('currentValue', inputField.val());
    inputField.removeAttr('readonly');
  });

  $(".cancel-icon").click(function () {
    let container = $(this).closest('.position-relative');
    container.find('.option-button').hide()
    container.find('.bi-pencil-fill').show();

    let inputField = container.find('.oldValue').css('cursor','not-allowed');;
    inputField.val(inputField.data('currentValue'));
    inputField.prop('readonly', true);
  });

  $('.name-save-icon').click(function(){
    let container = $(this).closest('.position-relative');
    let value = container.find('.oldValue').val();
    console.log(value)
    updateName(value);
  })
  $('.phoneNumber-save-icon').click(function(){
    let container = $(this).closest('.position-relative');
    let value = container.find('.oldValue').val();
    console.log(value);
    updatePhonenumber(value)
  })

  function updateName(value){
    $.ajax({
      url:`${baseURL}/api/updateUserName`,
      type:'PATCH',
      data:JSON.stringify({
        name:value
      }),
      contentType:'application/json',
      success:function (data,textStatus,xhr){
        if(xhr.status===200){
          console.log('name update:',data);
          location.reload()
        }
      },
      error:function(xhr,textStatus,errorThrown){
        if(xhr.status===400){
          console.log('updation failed:',xhr.responseText)
        }
      }
    })
  }
  
  
  function updatePhonenumber(value){
    $.ajax({
      url:`${baseURL}/api/updateUserMobileNumber`,
      type:'PATCH',
      data:JSON.stringify({
        phonenumber:value
      }),
      contentType:'application/json',
      success:function (data,textStatus,xhr){
        if(xhr.status===200){
          console.log('name update:',data);
          location.reload()
        }
      },
      error:function(xhr,textStatus,errorThrown){
        if(xhr.status===400){
          console.log('updation failed:',xhr.responseText)
        }
      }
    })
  }

});


