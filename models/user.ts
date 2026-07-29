import { model, Schema, type InferSchemaType } from 'mongoose'

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
)

export type User = InferSchemaType<typeof userSchema>

userSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: new Date() })
})

export default model<User>('User', userSchema)
