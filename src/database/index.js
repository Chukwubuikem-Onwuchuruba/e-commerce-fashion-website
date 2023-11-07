import mongoose from "mongoose";



const configOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const connectToDB = async () => {
    const connectionUrl = 'mongodb+srv://kolomental:Mff11c@cluster0.yhdxygk.mongodb.net/'

    mongoose.connect(connectionUrl, configOptions).then(() => console.log('E-commerce Fashion Website Database connected successfully!')).catch((err) => console.log(`Getting Error from DB connection ${err.message}`))
}

export default connectToDB