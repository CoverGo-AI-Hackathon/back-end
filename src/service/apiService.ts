import hcmacHelper from "src/helper/hcmacHelper"
import userRepository from "repository/userRepository"

export default {
    changePasswordService: async (email:string, newPassword:string) => {
        const newPasswordHash = hcmacHelper.hash(newPassword)

        await userRepository.changeUserPasswordByEmail(email, newPasswordHash)

        return newPasswordHash
    },

    changeInfoService: async (email:string, displayName:string, aboutMe:string, phone:string, dob:string, gender:string) => {
        const res = await userRepository.changeUserInfoByEmail(email, displayName, aboutMe, phone, dob, gender)

        return res
    }
}