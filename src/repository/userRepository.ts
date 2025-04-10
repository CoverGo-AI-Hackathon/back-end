import User from 'model/user'
import userInfo from 'model/userInfo'

export default {
    saveUserByInfo: async (email: string, displayName:string, picture:string) => {
        
        const newUser = new User({
            email: email,
            displayName: displayName,
            picture: picture
        })

        const newUserInfo = new userInfo({
            user: newUser
        })

        await newUser.save()
        await newUserInfo.save()
    },

    existUserByEmail: async (email: string) => {
        const existUser = await User.findOne({
            email: email
        })

        return existUser
    }
}