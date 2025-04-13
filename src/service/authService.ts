import hcmacHelper from "src/helper/hcmacHelper"
import userRepository from "repository/userRepository"

export default {
    loginWithEmail: async (email:string, password:string) => {
        const verify = await userRepository.verifyEmailAndPassword(email, password)

        return verify
    }
}