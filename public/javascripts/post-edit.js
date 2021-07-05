
    // find our post form
    let editForm = document.getElementById('postEditForm')
    // add a listener to the form
    editForm.addEventListener('submit', function(e) {
         // find length of uploaded imgs
    let uploadImages = document.getElementById('imageUpload').files.length;
    
    // find total number of existing imgs
    let existingImgs = document.querySelectorAll('.imageDeleteCheckbox').length;
    // find total number of potential deletion
    let deletionImgs = document.querySelectorAll('.imageDeleteCheckbox:checked').length;
    // figure out if the form can be submited or not
    let newTotal = existingImgs - deletionImgs + uploadImages
    if( newTotal > 4){
        e.preventDefault();
        const removalAmt = newTotal - 4
        alert(`You need to remove ${removalAmt} (more) image${removalAmt === 1 ? '' : 's'}!`)
    }
    });
   
