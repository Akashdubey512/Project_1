import dotenv from "dotenv"
import dns from "dns"
import connectDB from "./db/index.js";
import {app} from './app.js'
dotenv.config({
    path: './.env'
})
// Fix: Node.js defaults to 127.0.0.1 (local DNS proxy) which doesn't support
// SRV queries needed for mongodb+srv:// connection strings.
// Force use of Google's public DNS instead.
dns.setServers(['8.8.8.8', '8.8.4.4'])



connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})