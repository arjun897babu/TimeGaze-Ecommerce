  //block user
  $(document).ready(function () {
    $('.user_block').click(function () {
      const userId = $(this).attr('data-id');
      console.log(userId)
      blockUser(userId);
    });

    function blockUser(userId) {
      $.ajax({
        url: `/api/blockUser/${userId}`,
        type: 'PUT',
        contentType: 'application/json',
        success: function (data) {
          console.log('User blocked successfully', data);
          location.reload()
        
        },
        error: function (error) {
          console.error('Error blocking user', error);
         
        }
      });
    }
  });

  //unblock
  $(document).ready(function () {
    $('.user_unblock').click(function () {
      const userId = $(this).attr('data-id');
      console.log(userId)
      blockUser(userId);
    });

    function blockUser(userId) {
      $.ajax({
        url: `http://localhost:3000/api/unBlockUser/${userId}`,
        type: 'PUT',
        contentType: 'application/json',
        success: function (data) {
          console.log('User blocked successfully', data);
          location.reload()
         
        },
        error: function (error) {
          console.error('Error blocking user', error);
          
        }
      });
    }
  });