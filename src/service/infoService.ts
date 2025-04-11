import userRepository from "repository/userRepository"

export default {
    getInfoService: async (email: string) => {
        const user = await userRepository.getUserInfoByEmail(email)

        return user
    }
}