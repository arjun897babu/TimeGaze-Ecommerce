//block user
$(document).ready(function () {
  $('#updateCategory-form').on('submit', function (event) {

    event.preventDefault();

    let nameRegex = /^[a-zA-Z][a-zA-Z ']{1,18}[a-zA-Z]$/
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
          const {message} = JSON.parse(xhr.responseText)
          localStorage.setItem('updateCategory',message);
          window.location.href = '/adminCategory';
        }

      }, error: function (xhr, textStatus, errorThrown) {
        if (xhr.status === 400) {
          const {message} = JSON.parse(xhr.responseText)
          $('.errorDiv').text(message);
          $('#validateCateogryName').addClass('is-invalid');
          $('#validateCateogryName').removeClass('is-valid');
        }
        if(xhr.status===404){
          window.location.href = '/adminHome'
        }
      }
    });
  }
});
