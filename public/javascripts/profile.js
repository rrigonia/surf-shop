let newPasswordValue;
let confirmationValue;
const submitBtn = document.getElementById('update-profile');
const newPassword = document.getElementById('new-password');
const confirmationPassword = document.getElementById('password-confirmation');
const validationMessage = document.getElementById('validation-message');

function validatePasswords(message, add, remove) {
    validationMessage.textContent = message;
    validationMessage.classList.add(add);
    validationMessage.classList.remove(remove);
}

confirmationPassword.addEventListener('input', e => {
    newPasswordValue = newPassword.value;
    confirmationValue = confirmationPassword.value;
    if(newPasswordValue !== confirmationValue){
        validatePasswords('Passwords must match', 'color-red', 'color-green');
        submitBtn.setAttribute('disabled', true);
    } else {
        validatePasswords('Passwords match', 'color-green', 'color-red');
        submitBtn.removeAttribute('disabled');
    } 
    
});
