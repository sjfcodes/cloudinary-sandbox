window.addEventListener('load', function () {
    const img = document.getElementById('img-preview');
    const fileInputEl = document.querySelector('input[name="my-file"]')
    const textInputEl = document.querySelector('input[name="my-description"]')
    const submitBtn = this.document.querySelector('input[type=submit]')
    let myFile

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault()
        if (!myFile) return
        const description = textInputEl.value

        const formData = new FormData();
        formData.append('myFile', myFile);
        formData.append('myDescription', description);
        formData.append('anythingElse', 'add anything else to send');

        fetch('/api/upload', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                img.setAttribute('src', '')
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
                console.log(reader.result)
            };
        }
    });


});