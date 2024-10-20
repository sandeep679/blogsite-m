import { validateToken } from "../services/authentication.js"

function checkForAuthenticationCookie(req,res,next){
    return (req,res,next)=>{
        const tokenCookie = req.cookies['token'];
        if(!tokenCookie)
            return next();

        try {
            const userPayload = validateToken(tokenCookie);
            req.user=userPayload;
        } catch (error) {
            console.log(error)
        }
         return next();
    }
}

export {checkForAuthenticationCookie};