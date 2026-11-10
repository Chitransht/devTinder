const express = require('express');
const requestRouter = express.Router();

const  userAuth  = require('../middleware/auth');
const  ConnectionRequestModel  = require('../models/connectionRequest');


requestRouter.post("/request/send/:status/:toUserIdd", userAuth, async (req, res) => {
     try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserIdd;
        const status = req.params.status;

        const allowedStatuses = ['ignored', 'interested'];
        if(!allowedStatuses.includes(status)){
           return res.status(400).json({ message: "Invalid status value. Allowed values are 'ignored' or 'interested'" });
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({ message: "user not found" });
        }

        const existingRequest = await ConnectionRequestModel.findOne({
            $or:[
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })

        if(existingRequest){
            return res.status(400).json({ message: "Connection request already exists between these users" });
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();
        res.json({ message: "Connection request sent successfully", data });
    } catch(err){
        res.status(400).send({ message: err.message });
    }
})


requestRouter.post("request/review/:status/:requestId", userAuth, async (req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const {status, requestId} = req.params;

        const allowedStatuses = ['rejected', 'accepted'];
        if(!allowedStatuses.includes(status)){
            return res.status(400).json({ message: "Invalid status value. Allowed values are 'rejected' or 'accepted'" });
        }

        const connectionRequest = await ConnectionRequestModel.findOne({ _id: requestId, toUserId: loggedInUserId, status: 'interested' });

        if(!connectionRequest){
            return res.status(404).json({ message: "No pending connection request found for this user" });
        }
    
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({ message: "Connection request updated successfully", data });
    } catch(err_){
        res.status(400).send({ message: err_.message });
    }
})

module.exports = requestRouter;
