import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
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
        }
    },
    { 
        timestamps: true
    }
)

userSchema.pre('findOneAndUpdate', function() {
    this.set({ updatedAt: new Date() })
});

export default mongoose.model('User', userSchema)