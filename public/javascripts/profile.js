let newPasswordValue;
let confirmationValue;
const form = document.querySelector('form');
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
    } else {
        validatePasswords('Passwords match', 'color-green', 'color-red');
    } 
    
});

form.addEventListener('submit', e => {
    if(newPasswordValue !== confirmationValue){
        e.preventDefault();
        const error = document.getElementById('error');
        if(!error){
            const flashErrorH1 = document.createElement('h1');
            flashErrorH1.setAttribute('id', 'error');
            flashErrorH1.textContent = 'Password must match';
            flashErrorH1.classList.add('color-red');
            const navbar = document.getElementById('navbar');
            navbar.parentNode.insertBefore(flashErrorH1, navbar.nextSibling);
        }
    }
})
