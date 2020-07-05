function ready() {
    const
        form = document.getElementById('form'),
        nameInput = document.getElementById('nameInput'),
        emailInput = document.getElementById('emailInput'),
        phoneInput = document.getElementById('phoneInput'),
        nameError = document.getElementById('nameError'),
        emailError = document.getElementById('emailError'),
        phoneError = document.getElementById('phoneError'),
        sendBtn = document.getElementsByTagName('button')[0],
        modal = document.getElementsByClassName('successModal')[0];

    let formIsValid = true;

    function Validator() {

        this.validateInitials = function (val) {
            return (/^[А-Я][а-я]{1,20}\ [А-Я][а-я]{1,20}\ [А-Я][а-я]{1,20}$/.test(val.trim()))
        };

        this.validateEmail = function (val) {
            return (/^\w+([\.-]?\w+)*@gmail.com$/.test(val))
        };

        this.validatePhone = function (val) {
            if (val[0] === '8') {
                return (/^8[\d\(\)\ -]{9}\d$/).test(val);
            } else if (val[0] === '+' && val[1] === '7') {
                return (/^\+7[\d\(\)\ -]{9}\d$/).test(val);
            } else if (val[0] === '0' && val[1] === '7') {
                return (/^07[\d\(\)\ -]{9}\d$/).test(val);
            } else {
                return false;
            }
        };
    }

    const validator = new Validator();

    //обработчик на отправку формы
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        let data = {};
        formData.forEach(function (value, key) {
            data[key] = value.trim();
        });

        //вызываем методы валидации и при необходимости
        //выводим пользователю сообщения об ошибке
        if (!validator.validateInitials(data.name)) {
            nameInput.classList.add('input-error');
            nameError.classList.add('error');
            formIsValid = false;
        }

        if (!validator.validateEmail(data.email)) {
            emailInput.classList.add('input-error');
            emailError.classList.add('error');
            formIsValid = false;
        }

        if (!validator.validatePhone(data.phone)) {
            phoneInput.classList.add('input-error');
            phoneError.classList.add('error');
            formIsValid = false;
        }


        if (formIsValid) {
            //всплывающее окно
            modal.style.display = 'block';
            form.style.display = 'none';
            let elems = document.getElementsByClassName("success");
            for (let item of elems) {
                item.classList.add('hidden');
            }
            form.reset();

            //скрытие всплывающего окна
            setTimeout(function () {
                modal.style.display = 'none';
                form.style.display = 'block';

            }, 2000)

            //форма прошла фалидацию, отправка данных на сервер
            let result = sendData(data);
            //Дальнейшая обработка result...
        } else {
            sendBtn.setAttribute('disabled', 'true');
        }
    });

    //обработчик на впечатывание символов
    //вызывается через debounce функцию для
    // предотвращения частых вызовов методов валидатора
    form.addEventListener('keyup', debounce(function (e) {

        //скрытие ошибок с предыдущей отправки формы
        if (e.target.classList.contains('input-error')) {
            e.target.classList.remove('input-error');
        }
        if (e.target.nextElementSibling.children[0].classList.contains('error')) {
            e.target.nextElementSibling.children[0].classList.remove('error');
        }


        if (!form.getElementsByClassName('error').length){
            sendBtn.removeAttribute('disabled');
            formIsValid = true;
        }

        let value = e.target.value.trim();

        const successIcon = e.target.nextElementSibling.children[1];

        switch (e.target.id) {
            case 'nameInput': {
                if (validator.validateInitials(value)) {
                    if (successIcon.classList.contains('hidden')) successIcon.classList.remove('hidden');
                } else {
                    if (!successIcon.classList.contains('hidden')) successIcon.classList.add('hidden');
                }
                break;
            }
            case 'emailInput': {
                e.target.value = value;

                if (validator.validateEmail(value)) {
                    if (successIcon.classList.contains('hidden')) successIcon.classList.remove('hidden');
                } else {
                    if (!successIcon.classList.contains('hidden')) successIcon.classList.add('hidden');
                }
                break;
            }
            case 'phoneInput': {
                value = value.replace(/[\(\)\ -]/g, '');
                e.target.value = value;

                if (validator.validatePhone(value)) {
                    if (successIcon.classList.contains('hidden')) successIcon.classList.remove('hidden');
                } else {
                    if (!successIcon.classList.contains('hidden')) successIcon.classList.add('hidden');
                }
                break;
            }
        }
    }, 300));
}

function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result;
    if (null == wait) wait = 100;

    function later() {
        let last = Date.now() - timestamp;

        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
                context = args = null;
            }
        }
    };

    let debounced = function () {
        context = this;
        args = arguments;
        timestamp = Date.now();
        let callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }

        return result;
    };

    debounced.clear = function () {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };

    debounced.flush = function () {
        if (timeout) {
            result = func.apply(context, args);
            context = args = null;

            clearTimeout(timeout);
            timeout = null;
        }
    };

    return debounced;
};

//отправка данных на сервер
async function sendData(data) {
    console.log('отправка данных: ', data);
    try {
        // const response = await fetch('some_url', {
        //     method: 'POST',
        //     body: JSON.stringify(data)
        // });
        // const result = await response.json();
        // return JSON.parse(result);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

document.addEventListener("DOMContentLoaded", ready);
