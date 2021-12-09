window.addEventListener('load', function () {
    const img = document.getElementById('img-preview');
    const fileInputEl = document.querySelector('input[name="my-file"]')
    const descriptionInputEl = document.querySelector('input[name="my-description"]')
    const submitBtn = document.querySelector('input[type=submit]')
    const hostedLinkEl = document.getElementById('hosted-link')
    let myFile


    submitBtn.addEventListener('click', (e) => {
        e.preventDefault()
        if (!myFile) return
        const description = descriptionInputEl.value; // capture a value from form input
        descriptionInputEl.value = ''; // reset displaved text
        img.setAttribute('src', '') // remove selected image
        hostedLinkEl.innerText = '' // reset link text

        const formData = new FormData();

        // append all form input values to formData object
        formData.append('myFile', myFile);
        formData.append('description', description);
        formData.append('item1', 'another item from the form');

        fetch('/api/upload', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then((data) => {
                console.log(data) //display response
                submitBtn.setAttribute('disabled', true)
                img.setAttribute('src', data.url)
                hostedLinkEl.setAttribute('href', data.url)
                hostedLinkEl.innerText = `image is now hosted here`
            })
            .catch(err => console.error(err))
    })

    fileInputEl.addEventListener('change', ({ target }) => {

        if (target.files && target.files[0]) {
            myFile = target.files[0]
            img.onload = () => URL.revokeObjectURL(img.src); // no longer needed, free memory
            img.src = URL.createObjectURL(myFile); // set src to blob url
            const reader = new FileReader();
            reader.readAsDataURL(myFile);
            reader.onloadend = () => {
                submitBtn.removeAttribute('disabled')
                // console.log(reader.result)
            };
        }
    });


});