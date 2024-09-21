const mongoose=require('mongoose')
const url='mongodb://127.0.0.1:27017/wanderlust';
// const Listing=require("./test.js");
const initdata=require('./data.js')
const Listing = require('../Models/listing.js');
main().then(()=>{
console.log("connected")
})
.catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(url);
}

// Listing.insertMany(initdata.data).then(()=>{
//     console.log("successfull")
// })
// Listing.insertMany(data.data).then(()=>{
//     console.log('Listing')

// })
async function initDB(){
    await Listing.deleteMany({})
    const UpdatedData=initdata.data.map((obj)=>({...obj,owner:'66e9773c611348221de1a5ee'}));
    await Listing.insertMany( UpdatedData)
}
initDB();
console.log(initdata.data.map((obj)=>({...obj,owner:"66e42d4ea7f7e541b1882571"})));
