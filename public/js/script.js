window.addEventListener('load', function () {
    const img = document.getElementById('img-preview');
    const fileInputEl = document.querySelector('input[name="my-file"]')
    const submitBtn = this.document.querySelector('input[type=submit]')
    let myFile

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault()
        if (!myFile) return
        img.setAttribute('src', '')

        const formData = new FormData();
        formData.append('myFile', myFile);
        formData.append('item1', 'another item from the form')

        fetch('/api/upload', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(url => {
                console.log('success', url)
                img.setAttribute('src', url)
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