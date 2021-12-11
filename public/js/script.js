window.addEventListener('load', function () {
    const formEl = document.querySelector('form')
    const fileInputEl = document.querySelector('input[name="my-file"]');
    const fileInputLabel = document.getElementById('file-name');
    const descriptionInputEl = document.querySelector('textarea[name="my-description"]');
    const passwordInputEl = document.querySelector('input[type=password')
    const submitBtn = document.querySelector('button[type=submit]');
    const hostedLinkEl = document.getElementById('hosted-link');
    /** * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * when a media file is uploaded, the type (or mimetype)
     * of the file will have the value
     * '<type>/<file-extention>'
     * 
     * ex: 
     *      'image/png', 'audio/mp3', 'video/mp4'
     * ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ 
     * using the keys 'audio', 'image', 'video'
     * by grabbing the mimetype text before the slash
     * the correct DOM node can be targeted.
     * ex:
     *      mediaType['image'] (target the image element)
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    const mediaType = {
        audio: document.getElementById('audio-preview'),
        image: document.getElementById('image-preview'),
        video: document.getElementById('video-preview')
    };

    let myFile;

    const displaySelectedFileName = (name) => fileInputLabel.innerText = name
    const collectFormData = (myFile) => {
        const formData = new FormData();
        const description = descriptionInputEl.value; // capture a value from form input
        formData.append('myFile', myFile);
        formData.append('description', description);
        return formData
    }
    const validateForm = (file, password) => {
        if (file && password) {
            submitBtn.removeAttribute('disabled');
            return true
        }
        submitBtn.setAttribute('disabled', true);
        return false
    }
    const toggleLoading = () => submitBtn.classList.toggle('is-loading')
    const loadResults = (type, url) => {
        mediaType[type].setAttribute('src', url);
        displayMediaContent(mediaType[type]);
        hostedLinkEl.setAttribute('href', url);
        hostedLinkEl.innerText = `${type} is now hosted here`;
        type !== 'image' && mediaType[type].setAttribute('controls', null);
    };
    const displayMediaContent = (element) => element.classList.toggle("is-hidden");
    const resetPage = () => {
        fileInputEl.value = ''; // clear file input
        passwordInputEl.value = '';
        descriptionInputEl.value = ''; // reset displayed text 
        submitBtn.setAttribute('disabled', true); // disable submit btn
        hostedLinkEl.innerText = ''; // reset link text
        displaySelectedFileName(''); // remove file name
        resetMediaElements();
    };
    const resetMediaElements = () => {
        Object.keys(mediaType).forEach(type => {
            mediaType[type].src = ''
            mediaType[type].removeAttribute('controls')
        });
    };

    passwordInputEl.addEventListener('input', (e) => {
        if (!validateForm(myFile, e.target.value)) return
        console.log('active')
    })

    formEl.addEventListener('submit', (e) => {
        e.preventDefault()
        if (!validateForm(myFile, passwordInputEl.value)) return
        toggleLoading()
        const formData = collectFormData(myFile)

        fetch('/api/upload', {
            method: 'POST',
            headers: {
                'Authorization': `bearer ${passwordInputEl.value}`
            },
            body: formData
        })
            // resetPage()
            .then(res => res.json())
            .then((body) => {
                console.log(body);
                resetPage()
                const { mimetype, url } = body;
                loadResults(mimetype.split('/')[0], url);
                toggleLoading();
            })
            .catch(err => {
                console.error(err);
                toggleLoading();
            });
    })

    fileInputEl.addEventListener('change', function ({ target }) {
        if (target.files && target.files[0]) {
            myFile = target.files[0];
            console.log(myFile);
            displaySelectedFileName(myFile.name);

            const type = myFile.type.split('/')[0];
            resetMediaElements();
            mediaType[type].src = URL.createObjectURL(myFile); // set element src to blob url
            mediaType[type].setAttribute('controls', null);
            type === 'video' && mediaType[type].setAttribute('type', myFile.type);
            displayMediaContent(mediaType[type]);
        };

        const reader = new FileReader();
        reader.readAsDataURL(myFile);
        reader.onloadend = () => validateForm(myFile, passwordInputEl.value)
    });
});