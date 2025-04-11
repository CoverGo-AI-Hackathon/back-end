import { UserModel } from 'model/user'
// import userInfo from 'model/userInfo'
import { BaseRepository } from './base.repository'
import { IUserDoc } from 'src/interface/user.interface'


class UserRepository extends BaseRepository<IUserDoc> {
    constructor() {
        super(UserModel);
    }
    /**
     * Kiểm tra user có tồn tại theo email hay không
     * @param email 
     * @returns IUserDoc | null
     */
    async existUserByEmail(email: string): Promise<IUserDoc | null> {
        return this.model.findOne({ email });
    }

    /**
     * Tạo mới user bằng email, tên hiển thị và ảnh đại diện
     * @param email 
     * @param displayName 
     * @param picture 
     */
    async saveUserByInfo(email: string, displayName: string, picture: string): Promise<IUserDoc> {
        const newUser = new this.model({
            email,
            displayName,
            picture
        });
        return await newUser.save();
    }
}

export const userRepository = new UserRepository();