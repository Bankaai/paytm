const express = require('express');
const router = express.Router();

const z = require("zod");
const jwt =require ("jsonwebtoken");
const { User, Account } = require ("../db");
const JWT_SECRET =require ("../config"); 
const { authMiddleware } = require ("../middleware");
// here add all the endpoints



const sigunupBody = z.object({
    username: z.string().email(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string()

})

router.post("/signup", async (req,res)=> {

    console.log("post req is hit");
    

    // STEP 1: check if the inputs match the schema we need
    
    // success is a boolean value which depends if the req.body matches the signupSchema we drew up.
    const {success} = sigunupBody.safeParse(req.body)
    if(!success){
        return (
            res.status(411).json({
                message:"Invalid Inputs"
            })
        )
    }

    // STEP 2:  check if such inputs already exist in our database
    
    const existingUser = await User.findOne({
        username: req.body.username
    })

    if(existingUser) {
        return  res.status(411).json({
            message:" Username already used! "
        })
    }

    // STEP 3: Once the username and inputs are good to go create a user to save

    const User = await User.create ({
        username : req.body.username,
        password : req.body.password,
        firstName : req.body.firstName,
        lastName: req.body.lastName ,
    })

    const userId = User._id;
    await Account.create({
        userId,
        accountBalance: Math.random() * 1000
    })

    // STEP 3: Generate a token for each entry using its id
  

    const token = jwt.sign({
       userId 
    }, JWT_SECRET);

    // STEP 4: confirmation message
    res.json({
        message: "user created successfully!",
        token: token
    })
})

// The sign in route

// Creating a input validation schema
const signinBody = z.object({
    username: z.string().email(),
    password: z.string()
})

router.get("/signin", async(req,res)=> {

    const userId = req.body._id;
    const success = signinBody.safeParse(req.body);

    // if validation fails then the data isnt allowed to move to the database layer
    if(!success){
        return res.json(411).json({
            message: " data failed the input validation test "
        })
    }

    // first check is the username is present in the database and get it 

    const user = await User.findOne({username: req.body.username, password: req.body.password});


    // Now if the username and password checks out then generate a token for the user
    if(user){
    const token = sign({
        userId
     }, JWT_SECRET);
 
     // STEP 4: confirmation message
     res.json({
         message: "user Signed In successfully!",
         token: token
     })
     return ;
    }

    res.status(411).json({
        message: "error while logging in "
    })
})

const updateBody = z.object({
    password: z.string(),
    firstName: z.string(),
    lastName: z.string()
})


router.put("/",authMiddleware, async (req,res)=>{

    const {success} = updateBody.safeParse(req.body);
    if(!success){
        res.status(411).json({
            message: "Error while updating the information"
        })
    }

    await User.updateOne( {_id: req.userId},req.body );

    res.json({
        message: "user updated successfully"
    })


})

// Creating endpoint to get the users in our database
router.get("/bulk", async(req,res)=> {
    const filter = req.query.filter || ""

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex" : new RegExp(filter,'i') 
            }
        },{
                lastName: {
                    "$regex":  new RegExp(filter,'i') 
                }
            }]
    })

    res.json({
        user: users.map(user=> ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;