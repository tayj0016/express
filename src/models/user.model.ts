import bcrypt from 'bcrypt';

class User {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isAdmin: boolean;

    constructor(userId: number, firstName: string, lastName: string, email: string, password: string, isAdmin: boolean) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.isAdmin = isAdmin;
    }

    static ToUser(obj: any): User | boolean {
        return obj.hasOwnProperty('userId') && obj.hasOwnProperty('firstName') && obj.hasOwnProperty('lastName') && obj.hasOwnProperty('email') ? new User(obj.userId, obj.firstName, obj.lastName, obj.email, '', obj.isAdmin) : false;
    }

    // Return true if all the properties are filled in
    CompleteUser() {
        if (this.userId != null && this.firstName.length > 0 && this.lastName.length > 0 && this.email.length > 0 && this.password.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }

    validatePassword(password: string) {
        return bcrypt.compare(password, this.password);
    }

    // Return a user without the password property
    GetPasswordlessUser() {
        let pwdLess = new User(-1, '', '', '', '', false);
        Object.assign(pwdLess, this);
        let returnObj = <any>pwdLess;
        delete returnObj.password;
        return returnObj;
    }

}

// POPULATE USER ARRAY 
const userArray: any[] = [];
userArray.push(new User(1, "james", "taylor", "tayj0016@gmail.com", "test", true));
bcrypt.genSalt(10, function (err, saltRounds) {
    bcrypt.hash(userArray[0].password, saltRounds, function (err, hash) {
        userArray[0].password = hash;
    });
});

export { User, userArray }