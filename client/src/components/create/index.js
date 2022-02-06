import { useState } from "react";
import {SpinningCircleLoader} from "react-loaders-kit";
import  { Moralis } from 'moralis';
import loadingGif from "../../assets/blockLoading.gif";
import mintedGif from "../../assets/fishLoading.gif";

const ethers = require('ethers');
const contractJson = require('../../../src/abi/CreatorNFT.json');
const contractAddressJson = require('../../../src/abi/creator-contract-address.json');
const contractAbi = contractJson.abi
const contractAddress = contractAddressJson.CreatorNFT 
const API_URL = 'https://s3nlldgkmodi.usemoralis.com:2053/server';
const API_KEY = 'cOep3uCa15236HwUfmeHmvLtTiNBy3t2ePpveLsk';

function CreateChannel() {
  const [submitStatus, setSubmitStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState();
  const [minted, setMinted] = useState(false);

  // const creatorNFTcards = '../cards/prodcards';
   

  //  fs.readdir(creatorNFTcards, (err, files) => {
  //    files.forEach(file => {
  //   console.log("File ",file);
  //   });
  //  });
  
  async function handleSubmit(){
    setSubmitStatus(true);
    console.log("channel name: " + channelName);
    console.log("channel Description: " + desc);
    console.log(file);
    setLoading(true);
    await uploadDataAndMintNFT();
    console.log("Set Loading false")
    setLoading(false);
    setMinted(true);
    setTimeout(() => {
      console.log("congraulations on minting your creator NFT!");
      window.location.href = "/channel";
    }, 5000);
    return;
    // The logic to submit the info. Set 'setSubmitStatus' to true if a positive feedback is received.
  };

  async function uploadDataAndMintNFT() {
    await Moralis.start({ serverUrl: API_URL, appId: API_KEY });
    const image = new Moralis.File(file.name, file);
    console.log("Uploading file... ")
    await image.saveIPFS();
    console.log(image.ipfs(), image.hash())

    const imageURI = image.ipfs();

    const metadata = {
      "channel_name": channelName,
      "description": desc,
      "image":imageURI
    }
    const metadataFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
    await metadataFile.saveIPFS();
    const metadataURI = metadataFile.ipfs();

   // console.log("Metadata URI"+metadataURI)
   // console.log(JSON.stringify(contractAbi))

    await mintToken(metadataURI);
    return;
  }

  async function mintToken(_uri){
    console.log("Metadata URI "+_uri)
    const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);
    const txt = await contract.mintToken(_uri);
    
    console.log("Minted Token "+Object.keys(txt));
    return;
  }

  if(loading){
    return (
      <div className="create bg-purple-100">
        <div className="relative font-medium md:h-screen flex items-center content-center">
          <div className="mr-auto ml-auto w-full">
            <div className="w-full max-w-md mr-auto ml-auto mt-4 mb-1 text-center">
              <h1 className="text-gray-800 block text-3xl font-extrabold font-2xl">
                Creating your channel !!!
              </h1>
              <img src={loadingGif} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if(minted){
    return (
      <div className="create bg-purple-100">
        <div className="relative font-medium md:h-screen flex items-center content-center">
          <div className="mr-auto ml-auto w-full">
            <div className="w-full max-w-md mr-auto ml-auto mt-4 mb-1 text-center">
              <h1 className="text-gray-800 block text-3xl font-extrabold font-2xl">
                Congraulations on minting your creator NFT !
              </h1>
              <img src={mintedGif} />
              <p className="text-gray-800">You will be redirected to your dashboard in a moment !!!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create bg-purple-100">
      <div className="relative font-medium md:h-screen flex items-center content-center">
        <div className="mr-auto ml-auto w-full">
          <div className="w-full max-w-md mr-auto ml-auto mt-4 mb-1 text-center">
            <h1 className="text-gray-800 block text-3xl font-extrabold font-2xl">
              Create Channel
            </h1>
          </div>
          <div className="w-full max-w-md mr-auto ml-auto mt-4">
            <div className="bg-white shadow-lg rounded-md px-8 py-8 mb-4 ml-auto mr-auto">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="username"
                >
                  {" "}
                  Channel Name{" "}
                </label>
                <input
                  className="shadow-sm appearance-none border border-gray-400 rounded w-full py-4 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:border-purple-500"
                  id="channelName"
                  type="text"
                  placeholder="My Channel Name"
                  onChange={e => setChannelName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="username"
                >
                  {" "}
                  Channel Description{" "}
                </label>
                <input
                  className="shadow-sm appearance-none border border-gray-400 rounded w-full py-4 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:border-purple-500"
                  id="channelDescription"
                  type="text"
                  placeholder="My Channel Description"
                  onChange={e => setDesc(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="channelImage"
                >
                  {" "}
                  Channel Image{" "}
                </label>
                <input
                  className="shadow-sm appearance-none border border-gray-400 rounded w-full py-4 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:border-purple-500"
                  id="channelLogo"
                  type="file"
                  name="channelLogo"
                  alt="Channel Image"
                  placeholder="Channel Image"
                  onChange={e => setFile(e.target.files[0])}
                />
              </div>

              <div className="mb-6">
                <button
                  type="button"
                  className="bg-purple-500 hover:bg-purple-600 shadow-lg text-white font-semibold text-sm py-3 px-0 rounded text-center w-full hover:bg-tertiary duration-200 transition-all"
                  onClick={ () => {
                      if(channelName === "" || desc === "" || file === undefined){
                        window.alert("channel name or description or image cannot be empty");
                      }
                      else{
                        handleSubmit();
                      }
                    }
                  }
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateChannel;
