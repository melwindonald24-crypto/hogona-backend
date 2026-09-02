import { createClient } from "redis";

const redis= createClient({
    url: process.env.REDIS_URL
})

redis.on("error",(err)=>{
    console.log("Redis error: "+err.message)
    process.exit(1)
})

await redis.connect()

export default redis