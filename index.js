const multer = require('multer')
const  express = require('express');
const cors = require('cors');
const mongooes = require('mongoose'); 
 const bodyParser = require('body-parser');
const { Db } = require('mongodb');
const app = express()
const PORT = process.env.PORT||4000
 app.use(bodyParser.urlencoded({extended : false}));
 app.use(bodyParser.json());
 app.use(cors());
mongooes.connect("mongodb://localhost:27017/GasMark").then( function(){
    console.log("db connected");

   
 // const consumer_id = Math.floor(Math.random() * 65766607880);
   
//    var cureentdate = new Date();
//    console.log(cureentdate);


// new connection schema   
   
const newConnectionSchema ={
    firstname:String,
    lastname:String,
    mobilenumber:String,
    email:String,
    idproof:String,
    address:String,
    pincode:String,
    gender:String,
    dob:String,
    agency:String,
    nationality:String,
    cylindertype:String,
    
   
   
}

const newconnection = mongooes.model("newconnection",newConnectionSchema);

 
// insert data
app.post("/post",async(req,res)=>{
   
    const data = new newconnection({
    firstname:req.body.firstname,
    lastname:req.body.lastname,
    mobilenumber:req.body.mobilenumber,
    email:req.body.email,
    idproof:req.body.idproof,
    address:req.body.address,
    pincode:req.body.pincode,
    gender:req.body.gender,
    dob:req.body.dob,
    agency:req.body.agency,
    nationality:req.body.nationality,
    cylindertype:req.body.cylindertype,
    //consumer_id:req.body. consumer_id,
   // knowlegement_number:req.body.knowlegement_number,
   // dateandtime:req.body.dateandtime,
   // imageurl:req.file.filename,

    });
    const val = await data.save();
    res.send(val);


});

const sch1 ={
    delivery_type:String,
    day:String,
    time:String,
    consumer_id:String

}
const monmodel2 = mongooes.model("order_cylinder",sch1);
//insert data 

app.post("/booking", async(req,res)=>{
    const data = new monmodel2({
    delivery_type:req.body.delivery_type,
    day:req.body.day,
    time:req.body.time,
    consumer_id:req.body.consumer_id,

    });
    const val = await data.save();
    res.send(val);


});

// Update by id
app.put("/booking/:_id",async(req,res)=>{
    const {_id} = req.params;
    const {delivery_type} = req.body;
    const {day} = req.body;
    const {time} = req.body;
    const {consumer_id} = req.body;
    try {
        const updateProfile = await monmodel2.findByIdAndUpdate(_id,{delivery_type,day,time,consumer_id},{new:true});
        if(!updateProfile){
            return res.status(404).json({error:"Profile not found"});
        }
        res.json(updateProfile);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"server error"});
        
    };
});


    app.get('/detsils', async function(req,res){
        var getinfo= await newconnection.find();
        res.json(getinfo);
        

    });
    //delete api
    
    app.delete('/booking/_id', async function(req,res){
         await monmodel2.deleteOne({_id:req.params._id});
    
        const Response = {message : "Deleted sucessfully"};
        res.json(Response);
        

    });


 
});





const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null , './uploads');
    },
    filename: function(req,file,cb){
        cb(null,Date.now() +'__' + file.originalname);
    },
});
const upload= multer({storage:storage});




   
const lpgtransferSchema ={
    consumerid_from:String,
    consumer_name_from:String,
    mobilenumber_from:String,
    agency_from:String,
    connection_type:String,
    consumerid_to:String,
    consumer_name_to:String,
    mobilenumber_to:String,
    agency_to:String,
    select_state:String,
   
   
}

const lpgtransfer = mongooes.model("lpg_transfer",lpgtransferSchema);

 
// insert data
app.post("/transfer",async(req,res)=>{
   
    const transferDetails = new lpgtransfer({
    consumerid_from:req.body.consumerid_from,
    consumer_name_from:req.body.consumer_name_from,
    mobilenumber_from:req.body.mobilenumber_from,
    agency_from:req.body.agency_from,
    connection_type:req.body.connection_type,
    consumerid_to:req.body.consumerid_to,
    consumer_name_to:req.body.consumer_name_to,
    mobilenumber_to:req.body.mobilenumber_to,
    agency_to:req.body.agency_to,
    select_state:req.body.select_state,
    
    });
    const result = await transferDetails.save();
    res.send(result);


});



// amount +gst=    totalamount schema

const amountSchema ={
    amount:String,
    gst:String,
    total_amount:String,

}
const amount1 = mongooes.model("amount_details",amountSchema);
//insert data 

app.post("/amount", async(req,res)=>{
    const amount = new amount1({
    amount:req.body.amount,
    gst:req.body.gst,
    total_amount:req.body.total_amount,
    

    });
    const amountval = await amount.save();
    res.send(amountval);


});


// kyc first step provide personal details


const kycpersonlDetailsSchema ={
    firstname:String,
    lastname:String,
    email:String,
    mobile_number:String,
    gender:String,
    dob:String,
    address:String,
    pin_code:String,
    city:String,
    
}
const kycdetails = mongooes.model("kycdetails",kycpersonlDetailsSchema);
//insert data 

app.post("/kyc/personal/details", async(req,res)=>{
    const kycdetailssave = new kycdetails({
    firstname:req.body.firstname,
    lastname:req.body.lastname,
    email:req.body.email,
    mobile_number:req.body.mobile_number,
    gender:req.body.gender,
    dob:req.body.dob,
    address:req.body.address,
    pin_code:req.body.pin_code,
    city:req.body.city,


    });
    const kycdetailsresult = await kycdetailssave.save();
    res.send(kycdetailsresult);


});



// provide documents details

const kycdocumentsDetailsSchema ={
    driving_licence:String,
    aadhaar_card:String,
    pan_card:String,
    radio:String,
       
}
const kycdocument = mongooes.model("kycDocumentsdetails",kycdocumentsDetailsSchema);
//insert data 

app.post("/kyc/personal/documents/details", async(req,res)=>{
    const kycdocumentprovide = new kycdocument({
    driving_licence:req.body.driving_licence,
    aadhaar_card:req.body.aadhaar_card,
    pan_card:req.body.pan_card,
    radio:req.body.radio,
    
    });
    const kycfinalesult = await kycdocumentprovide.save();
    res.send(kycfinalesult);


});

// complain number

const complainSchema ={
    transfer_resion:String,
    query:String,
    

}
const complain1 = mongooes.model("complain_query",complainSchema);
//insert data 

app.post("/transfer/complain", async(req,res)=>{
    const complained = new complain1({
    transfer_resion:req.body.transfer_resion,
    query:req.body.query,
   
    

    });
    const complain = await complained.save();
    res.send(complain);


});





   
    app.listen(PORT, () => console.log(
        `Server is Started ${PORT}`
    
    ));
