import { TokenModel, UserModel } from '@/models'

export const cleanDb = async () => {
    await UserModel.deleteMany()
    await TokenModel.deleteMany()
}
