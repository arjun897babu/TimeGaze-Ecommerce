// otpcount down function

  let timeLeft = 120;
    let coutDownDiv = document.getElementById('otpCountDown');
    let otpVerify = document.getElementById('otpVerify')
    let resendButton = document.getElementById('otpResend')
    let timerId = setInterval(countDown, 1000);

    function countDown() {

      if (timeLeft === -1) {
        clearTimeout(timerId);
        coutDownDiv.innerHTML = ``;
        resendButton.classList.remove('disabled');
        otpVerify.disabled = true;
        timeLeft = 120;
      } else {
        coutDownDiv.innerHTML = ` Time remaing : ${timeLeft}s  `;
        --timeLeft;
      }
    }

    resendButton.addEventListener('click', () => {
      otpVerify.disabled = false;
      resendButton.classList.add('disabled');

    })
