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
            .select("email displayName role")

        return existUser
    },

    getUserInfoByEmail: async (email:string) => {
        const userWithInfo = await User.aggregate([
            { $match: { email: email } },
            {
              $lookup: {
                from: "user_info",             
                localField: "_id",
                foreignField: "user",
                as: "userInfo"
            }
            },
            {
                $unwind: {
                  path: "$userInfo",
                }
            },
            {
                $project: {
                    email: 1,
                    displayName: 1,
                    picture: 1,
                    aboutMe: "$userInfo.aboutMe",
                    phone: "$userInfo.phone",
                    dob: "$userInfo.dob",
                    gender: "$userInfo.gender",
                    money: 1,
                    _id: 0
                }
            }
          ]);

        return userWithInfo
    },

    addMoneyToUserByEmail: async (email:string, amount: number) => {
        const result = await User.findOneAndUpdate(
            { email }, 
            { $inc: { money: amount } }
        );
    }
}