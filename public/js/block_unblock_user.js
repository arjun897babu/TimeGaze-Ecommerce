  //block user
  $(document).ready(function () {
    $('.user_block').click(function () {
      const userId = $(this).attr('data-id');
      blockUser(userId);
    });

    function blockUser(userId) {
      $.ajax({
        url: `/api/blockUser/${userId}`,
        type: 'PUT',
        contentType: 'application/json',
        success: function (data) {
          location.reload()
        
        },
        error: function (xhr,textStatus,errorThrown) {
          if(xhr.status===404){
            window.location.href='adminHome'
          }
        }
      });
    }
  });

  //unblock
  $(document).ready(function () {
    $('.user_unblock').click(function () {
      const userId = $(this).attr('data-id');
      blockUser(userId);
    });

    function blockUser(userId) {
      $.ajax({
        url: `api/unBlockUser/${userId}`,
        type: 'PUT',
        contentType: 'application/json',
        success: function (data) {
          location.reload()
         
        },
        error: function (xhr,textStatus,errorThrown) {
          if(xhr.status===404){
            window.location.href='adminHome'
          }
        }
      });
    }
  });