// const Swal = require('sweetalert2')

// fetching all lessons buttons
const loadingAllLessons = async () => {
    try {
        const response = await fetch('https://openapi.programming-hero.com/api/levels/all')
        const data = await response.json()
        displayAllLessonsBtn(data.data)
    }
    catch (err) {
        console.log(err);
    }

};


// displaying all lessons buttons

const displayAllLessonsBtn = (lessons) => {
    const lessonBtnContainer = document.getElementById('lesson-btn-container')


    lessons.forEach(lesson => {
        const button = document.createElement('button')
        button.classList = 'focus:bg-blue-800 focus:text-white my-2 text-blue-800 mx-4 font-bold border-blue-400 border px-4 py-1 cursor-pointer hover:text-white hover:bg-blue-800 transition-all delay-75'
        button.innerHTML = `<i class="fa-solid fa-book-open"></i> Lesson-${lesson.level_no}`
        button.addEventListener('click', () => loadLevelsById(lesson.level_no))
        lessonBtnContainer.appendChild(button)
    })
}


// fetching all lessons by id when click in a lesson
const loadLevelsById = (id) => {
    // showing spinner while data loading

    const wordContainer = document.getElementById('word-container')
    const loaderSpinner = document.getElementById('loader-spinner')
    loaderSpinner.classList.remove('hidden')
    wordContainer.innerHTML = '';
    fetch(`https://openapi.programming-hero.com/api/level/${id}`)
        .then(res => res.json())
        .then(data => {

            displayLessonsById(data.data)

        })
        .catch(err => console.log(err))
        .finally(() => {
            // hiding spinner
            loaderSpinner.classList.add('hidden')
        })
}



// show by id


const displayLessonsById = (lessons) => {

    const noLessons = document.getElementById('no-lessons')
    if (!lessons.length) {
        noLessons.classList.remove('hidden')
    }

    if (lessons.length) {
        noLessons.classList.add('hidden')
    }

    // showing/hiding error page if no lessons is available for a button

    const fixedContainer = document.getElementById('fixed-container')
    fixedContainer.classList.add('hidden')
    const wordContainer = document.getElementById('word-container')
    wordContainer.innerHTML = '';


    // generating word card dynamically

    lessons.forEach(lesson => {
        const { word, meaning, pronunciation, id } = lesson;

        const div = document.createElement('div')

        div.innerHTML = `
        <div class="text-center bg-slate-200 p-6 m-5 rounded-md shadow-md">
            <h3 class="font-bold text-xl">${word ? word : 'Not Available'}</h3>
            <p class=" my-2" >Meaning/Pronounciation</p>
            <p class="font-bold bangla-font" >"${meaning ? meaning : 'Not Available'} / ${pronunciation ? pronunciation : 'Not Available'}"</p>
            <div class="flex justify-between mt-3">
                <div onclick="fetchingWordsDetails(${id})" class="rounded bg-slate-100 px-4 py-3">
                    <button><i class="fa-solid fa-circle-exclamation"></i></button>
                </div>
                <div onclick="pronounceTheWord('${word}')" class="rounded bg-slate-100 px-4 py-3">
                    <button><i class="fa-solid fa-volume-high"></i></button>
                </div>
            </div>
        </div>
        
        `
        wordContainer.appendChild(div)

    })

}

// fetching words details by id

function fetchingWordsDetails(id) {
    const modalBtn = document.getElementById('modal-btn')
    modalBtn.click()

    fetch(`https://openapi.programming-hero.com/api/word/${id}`)
        .then(res => res.json())
        .then(data => displayWordsDetails(data.data))
};

// display words details in a modal by unique id

const displayWordsDetails = (wordDetails) => {
    const { word, meaning, pronunciation, sentence, synonyms } = wordDetails;

    const modalContainer = document.getElementById('modal-container')

    modalContainer.innerHTML = `
    <div class="p-5 bg-slate-100 rounded-sm">
        <h2 class="font-bold">${word ? word : 'Not Available'} <span class="bangla-font">(<i class="fa-solid fa-microphone"></i> : ${pronunciation ? pronunciation : 'Not Available'})</span></h2>
        <h5 class="font-bold mt-6">Meaning</h5>
        <p class="bangla-font">${meaning ? meaning : 'Not Available'}</p>

        <h4 class="font-bold mt-6 mb-2">Example</h4>
        <p>${sentence ? sentence : 'Not Available'}</p>

        <p class="mt-6 mb-1 font-bold bangla-font">সমার্থক শব্দগুলো হলো</p>
        <div class="flex space-x-2">
        ${synonyms.length ? synonyms.map(synonym => `<div class="bg-slate-200 px-4 py-2">${synonym}</div>`).join('') : ''}
        </div>
    </div>

    `
    // console.log(word);
};


// Login functionality start

document.getElementById('login-btn').addEventListener('click', loginFunctionality)


function loginFunctionality() {


    // getting input values
    const nameField = document.getElementById('name-field')
    const codeField = document.getElementById('code-field')

    const nameFieldValue = nameField.value
    const codeFieldValue = codeField.value

    console.log(nameField, codeField);

    // getting all sections by ID

    const navSection = document.getElementById('nav-section')
    const bannerSection = document.getElementById('banner-section')
    const learningSection = document.getElementById('learning-section')
    const faqSection = document.getElementById('faq_section')


    // adding login condition

    if (nameFieldValue === '') {
        alert('Enter A valid name')
        return;
    }
    if (codeFieldValue === '123456') {
        // removing hidden class from all sections
        navSection.classList.remove('hidden')
        bannerSection.classList.add('hidden')
        learningSection.classList.remove('hidden')
        faqSection.classList.remove('hidden')

        // setting input field empty
        nameField.value = ''
        codeField.value = ''
        window.location.hash = "nav-section"
        Swal.fire({
            title: "Successfully Logged In!",
            text: "Login Successfull!",
            icon: "success"
        });


    }
    else {
        alert('Invalid User Name or logic code')
    }
}
// Login functionality end

// log out functionality start

document.getElementById('logout-btn').addEventListener('click', logOutFunction)

// logout function implement
function logOutFunction() {
    // getting all section by ID name
    const navSection = document.getElementById('nav-section')
    const bannerSection = document.getElementById('banner-section')
    const learningSection = document.getElementById('learning-section')
    const faqSection = document.getElementById('faq_section')

    // adding hidden class to all section

    navSection.classList.add('hidden')
    bannerSection.classList.remove('hidden')
    learningSection.classList.add('hidden')
    faqSection.classList.add('hidden')


}

// log out functionality end


// pronouncing the word functionality start

const pronounceTheWord = (word) => {
    console.log(word);
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);


}



// pronouncing the word functionality end




loadingAllLessons()