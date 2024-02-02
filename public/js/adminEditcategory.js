//block user
$(document).ready(function () {
  $('#updateCategory-form').on('submit', function (event) {
    let nameRegex = /^[a-zA-Z][a-zA-Z ']{1,18}[a-zA-Z]$/


    event.preventDefault();

    const updatedName = $('#validateCateogryName').val()
    const categoryId = $(this).attr('data-id');
    
    if (updatedName == '') {
      $('.errorDiv').text('Field is requried');
      $('#validateCateogryName').addClass('is-invalid');
      $('#validateCateogryName').removeClass('is-valid');
      return false
    }
    if (!nameRegex.test(updatedName)) {
      $('.errorDiv').text('enter a valid name');
      $('#validateCateogryName').addClass('is-invalid');
      $('#validateCateogryName').removeClass('is-valid');
      return false
    }

    $('.errorDiv').text('');
    $('#validateCateogryName').removeClass('is-invalid');
    $('#validateCateogryName').addClass('is-valid');

    updateCategory(categoryId, updatedName);
  });

  function updateCategory(categoryId, updatedName) {
    $.ajax({
      url: `/api/updateCategory/${categoryId}`,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        name: updatedName
      }),
      success: function (data, textStatus, xhr) {
        if (xhr.status === 200) {
       
          console.log('Category updated successfully', data);
          window.location.href = '/adminCategory';
        } else if (xhr.status === 400) {
          console.log('Category name already exists', data);
        } else {
       
          console.error('Unexpected status code:', xhr.status);
        }


      }, error: function (xhr, textStatus, errorThrown) {
        console.error('Error updating the category');
        console.log('Response:', xhr.responseText); 
        if (xhr.status === 400) {
          $('.errorDiv').text(xhr.responseText);
          $('#validateCateogryName').addClass('is-invalid');
          $('#validateCateogryName').removeClass('is-valid');
        }
      }
    });
  }
});
