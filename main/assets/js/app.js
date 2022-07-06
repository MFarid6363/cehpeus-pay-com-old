class Accordion {
    constructor(id) {
        let element = document.querySelector('[data-accordion="'+id+'"]');
        if (!element) {
            return;
        }

        let select = element.querySelector('[data-accordion-select=""]');
        if (!select) {
            return;
        }

        select.addEventListener('click', function () {
            element.classList.toggle('show');
        });

        let items = element.querySelectorAll('[data-value]');
        if (items.length) {
            for (let i in items) {
                if (items[i].addEventListener) {
                    items[i].addEventListener('click', function () {
                        element.classList.remove('show');
                        select.querySelector('[data-accordion-selected]').innerHTML = items[i].dataset.value;
                        return false;
                    });
                }
            }
        }
    }
};

class Dropdown {
    constructor(element) {
        if (!element.querySelector) {
            return;
        }

        let button = element.querySelector('[data-dropdown-button=""]');
        let menu = element.querySelector('[data-dropdown-menu=""]');

        if (!button || !menu) {
            return;
        }

        button.addEventListener('click', function () {
            menu.classList.toggle('show');
        });

        let items = menu.getElementsByClassName('dropdown-item');
        for (let i in items) {
            if (items[i].addEventListener) {
                items[i].addEventListener('click', function () {
                    menu.classList.toggle('show');
                });
            }
        }

        document.addEventListener('click', function(event) {
            if (!element.contains(event.target)) {
                menu.classList.remove('show');
            }
        });
    }
};

class Cookieconsent {
    name = 'cookieconsent';
    value = 'dismissed';

    constructor() {
        const name = this.name;
        const value = this.value;

        const btn = document.querySelector('.btn-cookie-dismiss');
        if (btn) {
            btn.addEventListener('click', function() {
                const date = new Date();
                date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
                document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
                document.querySelector('.cookie-banner').remove();
            });
        }

        this.dismissed();
    }

    dismissed() {
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookies = decodedCookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie === `${this.name}=${this.value}`) {
                return true;
            }
        }
        document.querySelector('.cookie-banner').classList.add('show');
    }
};

class NavbarToggler {
    constructor() {
        let element = document.querySelector('.navbar-toggler');
        if (!element) {
            return;
        }

        let navbar = document.querySelector('.navbar-collapse');

        element.addEventListener('click', function(event) {
            navbar.classList.toggle('show');
        });
    }
};

class FieldValidator {
    email(email) {
        return String(email)
            .toLowerCase()
            .match(
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            );
    }

    text(text) {
        const string = String(text);
        return string.replace(/ /g, '').length > 0;
    }

    phone(text) {
        if (!this.text(text)) {
            return false;
        }
        return String(text).match(
            /^[\+\d]?(?:[\d-.\s()]*)$/
        );
    }

    file(file) {
        if (!file.files || !file.files[0]) {
            return false;
        }

        console.log(file.value);
        const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif|\.pdf|\.doc|\.docx|\.txt|)$/i;
        if (!allowedExtensions.exec(file.value)) {
            return false;
        }

        return true;
    }
}

class Alerts {
    constructor(form) {
        this.form = form;
    }

    alert(element, isShow) {
        if (element.dataset.error) {
            let alert = this.form.querySelector('[data-error-alert="' + element.dataset.error + '"]');
            if (alert) {
                if (isShow) {
                    alert.classList.add('show');
                }
                else {
                    alert.classList.remove('show');
                }
            }
            if (isShow) {
                element.classList.add('has-error');
            }
            else {
                element.classList.remove('has-error');
            }
        }
    }

    hasErrors() {
        return this.form.getElementsByClassName('has-error').length > 0;
    }

    success(show) {
        let success = this.form.querySelector('.success');
        if (show) {
            success.classList.add('show');
        }
        else {
            success.classList.remove('show');
        }
    }
}

class SubscribeForm {
    constructor() {
        this.form = document.getElementById('subscribe_form');
        if (!this.form) {
            return;
        }

        this.form.addEventListener('submit', this.submit.bind(this));
        this.fieldValidator = new FieldValidator();
        this.alerts = new Alerts(this.form);
    }

    submit(e) {
        e.preventDefault();

        this.alerts.success(false);

        if (this.validate()) {
            let fields = this.fields();

            let data = new FormData();
            data.append('form', 'subscribe');
            data.append('country', fields.country.value);
            data.append('email', fields.email.value);

            fetch(this.form.getAttribute('action'), {
                method: 'POST',
                body: data,
            })
                .then((data) => {
                    this.alerts.success(true);
                    this.form.reset();
                })
                .catch((error) => {
                });
        }

        return false;
    }

    fields() {
        return {
            country: this.form.querySelector('input[name="country"]'),
            email: this.form.querySelector('input[name="email"]')
        };
    }

    validate() {
        let fields = this.fields();

        this.alerts.alert(fields.email, false);
        if (!this.fieldValidator.email(fields.email.value)) {
            this.alerts.alert(fields.email, true);
        }

        return !this.alerts.hasErrors();
    }
};

class CVForm {
    constructor() {
        this.form = document.getElementById('cv_form');
        if (!this.form) {
            return;
        }

        this.form.addEventListener('submit', this.submit.bind(this));
        this.fieldValidator = new FieldValidator();
        this.alerts = new Alerts(this.form);

        this.fileEvents();
    }

    submit(e) {
        e.preventDefault();

        this.alerts.success(false);

        if (this.validate()) {
            let fields = this.fields();

            let data = new FormData();
            data.append('form', 'cv');
            data.append('country', fields.country.value);
            data.append('firstName', fields.firstName.value);
            data.append('lastName', fields.lastName.value);
            data.append('email', fields.email.value);
            data.append('comment', fields.comment.value);
            data.append('uploadFile', fields.uploadFile.files[0]);

            fetch(this.form.getAttribute('action'), {
                method: 'POST',
                body: data,
            })
                .then((data) => {
                    this.alerts.success(true);
                    this.form.reset();
                    this.fileReset();
                })
                .catch((error) => {
                });
        }

        return false;
    }

    fields() {
        return {
            country: this.form.querySelector('input[name="country"]'),
            firstName: this.form.querySelector('input[name="first_name"]'),
            lastName: this.form.querySelector('input[name="last_name"]'),
            phoneNumber: this.form.querySelector('input[name="phone_number"]'),
            email: this.form.querySelector('input[name="email"]'),
            comment: this.form.querySelector('input[name="comment"]'),
            uploadFile: this.form.querySelector('input[name="upload_file"]'),
        };
    }

    validate() {
        let fields = this.fields();

        this.alerts.alert(fields.firstName, false);
        if (!this.fieldValidator.text(fields.firstName.value)) {
            this.alerts.alert(fields.firstName, true);
        }

        this.alerts.alert(fields.lastName, false);
        if (!this.fieldValidator.text(fields.lastName.value)) {
            this.alerts.alert(fields.lastName, true);
        }

        this.alerts.alert(fields.email, false);
        if (!this.fieldValidator.email(fields.email.value)) {
            this.alerts.alert(fields.email, true);
        }

        this.alerts.alert(fields.phoneNumber, false);
        if (!this.fieldValidator.phone(fields.phoneNumber.value)) {
            this.alerts.alert(fields.phoneNumber, true);
        }

        this.alerts.alert(fields.uploadFile, false);
        if (!this.fieldValidator.file(fields.uploadFile)) {
            this.alerts.alert(fields.uploadFile, true);
        }

        return !this.alerts.hasErrors();
    }

    fileEvents() {
        let fields = this.fields();

        fields.uploadFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            this.form.querySelector('.custom-file-upload').innerHTML = file.name;
        });
    }

    fileReset() {
        this.form.querySelector('.custom-file-upload').innerHTML = 'Select one...';
    }
};

const dropdowns = document.querySelectorAll('[data-dropdown]');
for (let i in dropdowns) {
    let dd = new Dropdown(dropdowns[i]);
}

let countries1 = new Accordion('countries');
let countries2 = new Accordion('countries-from');
let countries3 = new Accordion('countries-to');
let cookieconsent = new Cookieconsent();
let navbarToggler = new NavbarToggler();
let subscribeForm = new SubscribeForm();
let cvForm = new CVForm();
