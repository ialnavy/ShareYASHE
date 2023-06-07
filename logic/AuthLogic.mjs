class AuthLogic {
    constructor(session) {
        this.session = session;
    }

    isUserLogged() {
        return (!(this.session.username === null || typeof (this.session.username) === 'undefined'
            || this.session.username === '' || this.session.username.length === 0))
    }

    getLoggedUsername() {
        if (!this.isUserLogged(this.session))
            return null;
        return (new String(this.session.username)).toString();
    }

    isUsernameValid(username) {
        return (!(username === null || typeof (username) === 'undefined'
            || username === '' || username.length < 3));
    }

    isPasswordValid(password) {
        return (!(password === null || typeof (password) === 'undefined'
            || password === '' || password.length < 3));
    }

    cipherPassword(password, app) {
        return app.get("crypto").createHmac('sha512', app.get('key')).update(password).digest('hex');
    }

    isEmailValid(email) {
        let emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

        if (!email)
            return false;

        if (email.length > 254)
            return false;

        let valid = emailRegex.test(email);
        if (!valid)
            return false;

        // Further checking of some things regex can't handle
        let parts = email.split("@");
        if (parts[0].length > 64)
            return false;

        let domainParts = parts[1].split(".");
        if (domainParts.some(function (part) {
            return part.length > 63;
        }))
            return false;

        return true;
    }
}

export {AuthLogic};