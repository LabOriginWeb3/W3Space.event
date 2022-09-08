const express = require("express");
const bodyParser = require("body-parser")
const multer  = require('multer')
const { NFTStorage, File, Blob } = require('nft.storage')
require("dotenv").config();
const upload = multer()
const nft_storage_key = process.env.NFT_STORAGE_KEY
const client = new NFTStorage({ token: nft_storage_key })
const Web3 = require('web3');
const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.GNOSIS_URL)
);
const w3eventsAddress = process.env.W3EVENTS_CONTRACT_ADDRESS;
const W3Events = require('./abi/w3events.json');
const w3events = new web3.eth.Contract(W3Events, w3eventsAddress);
const { address: admin } = web3.eth.accounts.wallet.add(process.env.ADMIN_WALLET_KEY);
const app = express();
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.raw());

app.get("/users/:address", function(req, res) {
    console.log(req.params.address)
    res.send(req.params)
});

app.post("/events/poster", upload.single('poster'), async function(req, res) {
    const file = req.file
    const imageFile = new Blob([file.buffer])
    const cid = await client.storeBlob(imageFile)
    res.send(cid);
});

app.post("/events", async function(req, res) {
    let methodName = req.body.method;
    const tx = await w3events.methods[""]();
    let gas = 500000;
    try {
        gas = await tx.estimateGas({from: admin});
    } catch (e) {
        console.log(e.message)
        return res.status(500).send({
            message: e.message
        });
    }
    const data = tx.encodeABI();
    let gasPrice = await web3.eth.getGasPrice();
    const txData = {
        from: admin,
        to: w3eventsAddress,
        data,
        gas,
        gasPrice
    }
    const receipt = await web3.eth.sendTransaction(txData);
    console.log(`Transaction hash: ${receipt.transactionHash}`);
    res.send(receipt);
});

app.listen(3000, function(){
    console.log("server is running on port 3000");
})
