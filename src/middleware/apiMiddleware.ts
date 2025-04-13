import { Request, Response, NextFunction } from 'express';
import respond from 'view/respond';
import jwtHelper from 'src/helper/jwtHelper';
import jwtService from 'service/jwtService';
import redisService from 'service/redisService';

export default {
    verifyToken: async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

        const fingerprintHeader = req.headers['x-fingerprint'];
        const fingerprint = Array.isArray(fingerprintHeader) 
            ? fingerprintHeader[0] 
            : fingerprintHeader || 'unknown';
    
        if (!token) {
            res.status(401).json(respond(401, "Token Not Found"));

            return
        }

        let jwt = null

        try {
            jwt = await jwtService.verifyJWTForUser(token, fingerprint)

            const tokenCheck = await redisService.getItem(`BLACK_LIST_TOKEN:${jwt.uuid}`)
            console.log(jwt.email, jwt.passwd)

            if (tokenCheck) {
                res.status(401).json(respond(401, "Token Has Been Invalidated"))
                return
            }
        } catch(err: any) {
            if (err.name === 'TokenExpiredError') {
                const newToken = jwtService.verifyAndGenJwtToken(token, fingerprint)
                    .then(data => {
                        res.status(401).json(respond(401, {
                            "message": "Token Expired",
                            "newToken": data
                        }))
                    }).catch((e) => {
                        res.status(401).json(respond(401, {
                            "message": "Wrong Token"
                        }))
                    })
            } else {
                res.status(401).json(respond(401, "Fail To Verify Token"))
            }

            return
        }
        
        // @ts-ignore
        req.user = jwt
        next();
    }
}