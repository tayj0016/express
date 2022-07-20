import express from 'express';
import { IncomingHttpHeaders } from 'http';
import { User, userArray } from '../models/user.model';
import jwt from 'jsonwebtoken';


export class JWTAuth {
    static SecretSalt = '3B6EE5719030481808A3DF9193326C6ED8B4D3566818DB551C73226B1736292A';

    static VerifyToken(headers: IncomingHttpHeaders) {
        // console.log(headers.authorization);
        if (headers.authorization && headers.authorization.split(' ')[0] === 'Bearer') {
            try
            {
                let user =jwt.verify(headers.authorization.split(' ')[1],JWTAuth.SecretSalt) as any;

                if(user.UserData)
                {
                    let currentUser = User.ToUser(user.UserData)
                    if(currentUser instanceof User)
                    {
                        if(userArray.find(u=>u.userId===(<User>currentUser).userId))
                            return currentUser;
                        else
                            throw `Invalid user ${(<User>currentUser).userId}`;
                    }
                    else
                        throw 'Malformed User Data in JWT'
                }
                else
                        throw 'Malformed User Data in JWT'
            }
            catch(ex)
            {
                return ex;
            }
        }
        else
            return 'Invalid Authorization Header';
    }

    static GenerateWebToken(user: User) {
        let token = jwt.sign({ UserData: user }, JWTAuth.SecretSalt, { subject: user.firstName });
        return token;
    }
}