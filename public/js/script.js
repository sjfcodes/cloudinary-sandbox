window.addEventListener('load', function () {
    const img = document.getElementById('img-preview');
    const fileInputEl = document.querySelector('input[name="my-file"]')
    const submitBtn = document.querySelector('input[type=submit]')
    const hostedLinkEl = document.getElementById('hosted-link')
    let myFile


    submitBtn.addEventListener('click', (e) => {
        e.preventDefault()
        if (!myFile) return
        img.setAttribute('src', '') // remove selected image
        hostedLinkEl.innerText = '' // reset link text

        const formData = new FormData();
        formData.append('myFile', myFile);
        formData.append('item1', 'another item from the form')

        fetch('/api/upload', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(url => {
                console.log('success', url) //display hosted image
                img.setAttribute('src', url)
                hostedLinkEl.setAttribute('href', url)
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