import userRepository from "repository/userRepository"

export default {
    addMoneyToUser: (email:string, amount:number) => {
        console.log(`Add ${amount} to ${email}`)

        userRepository.addMoneyToUserByEmail(email, amount)
    }
}