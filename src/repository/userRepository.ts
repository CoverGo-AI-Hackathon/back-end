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
    },

    changeUserPasswordByEmail: async (email:string, newPassword:string) => {
        const result = await User.findOneAndUpdate(
            { email }, 
            { $set: { password: newPassword } }
        );
    },

    changeUserInfoByEmail: async (email:string, displayName:string, aboutMe:string, phone:string, dob:string, gender:string) => {
        const updatedUser = await User.findOneAndUpdate(
            { email: email }, // Điều kiện tìm kiếm user theo email
            { displayName: displayName }, // Cập nhật displayName
            { new: true } // Trả về document sau khi update
        );
        
        if (!updatedUser) {
        throw new Error('User not found');
        }

        const updatedUserInfo = await userInfo.findOneAndUpdate(
            { user: updatedUser._id }, // Điều kiện tìm kiếm userInfo theo user ID
            { aboutMe, phone, dob, gender }, // Cập nhật thông tin
            { new: true, upsert: true } // Trả về document sau khi update, nếu không có thì tạo mới
        );

        //@ts-ignore
        return await await User.aggregate([
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
    },

    verifyEmailAndPassword: async (email:string, password:string) => {
        const user = await User.findOne({ email })

        return user?.password == password
    }
}