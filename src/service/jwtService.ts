import jwtHelper from "src/helper/jwtHelper"
import userRepository from "repository/userRepository"

export default {
    verifyAndGenJwtToken: async (token:string, fingerprint:string) => {
        const payLoad = jwtHelper.getPayloadFromToken(token)

        const email = payLoad['email']

        const user = await userRepository.existUserByEmail(email)

        if(
            user!.password == payLoad.password &&
            user!.email == payLoad.email &&
            fingerprint == payLoad.fingerprint
        ) {
            return jwtHelper.jwtSign(email, fingerprint, user!.password)
        }

        throw Error("Cant Create New Token")
    },

    verifyJWTForUser: async (token:string, fingerprint:string) => {
        const payLoad = jwtHelper.getPayloadFromToken(token)

        const email = payLoad['email']

        const user = await userRepository.existUserByEmail(email)

        // if(user!.password == payLoad.passwd || payLoad.passwd=='null') {
        //     console.log("passwd equal")
        // }

        // if(user!.email == payLoad.email) {
        //     console.log("email equal")
        // }

        if(
            (user!.password == payLoad.passwd || payLoad.passwd=='null') &&
            user!.email == payLoad.email
        ) {
            return jwtHelper.jwtVerify(token)
        }

        throw Error("Can not verify token")
    },
}