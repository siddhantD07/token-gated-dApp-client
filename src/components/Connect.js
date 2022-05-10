import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Form from "./Form";
import { useState, useEffect } from "react";
import Web3 from "web3";
import { ABI, CONTRACT_ADDRESS } from "../constants";

const Connect = () => {
//   const web3Default = new Web3("https://cloudflare-eth.com/");
//   var contract = new web3Default.eth.Contract(ABI, ADDRESS);
//   console.log(contract);

  const [account, setAccount] = useState(null);
  const [verify, setVerify] = useState(0);

  let balance = 0;

  // useEffect(() => {
  //   console.log("changed account");
  //   const getBalances = async () => {
  //       balance = Number(await contract.methods.balanceOf(account).call());
  //       console.log(balance);
  //   }
  //   if(account){
  //       getBalances();
  //   }
  // }, [account]);

  try {
    window.ethereum.on("accountsChanged", (accounts) => {
      setAccount(accounts[0]);
      setVerify(0);
    });
  } catch (error) {
    console.log("No ethereum");
  }

  const verifyBalance = async () => {
    if (window.ethereum) {
        await window.ethereum.send("eth_requestAccounts");
        window.web3 = new Web3(window.ethereum);
        var contract = new window.web3.eth.Contract(ABI, CONTRACT_ADDRESS);
        console.log(contract);
        var accounts = await window.web3.eth.getAccounts();
        setAccount(accounts[0]);
        if (account) {
          balance = Number(await contract.methods.balanceOf(account).call());
          if(balance>0) setVerify(1);
        }
      }
  }

  const conn = async () => {
    if (window.ethereum) {
      await window.ethereum.send("eth_requestAccounts");
      window.web3 = new Web3(window.ethereum);
      var accounts = await window.web3.eth.getAccounts();
      setAccount(accounts[0]);
    }
  };
  
  return (
    <Box>
      <Button variant="contained" onClick={conn}>
        Connect
      </Button>
      <Typography variant="h5">{account}</Typography>
      <Button variant="contained" onClick={verifyBalance}>
        Enter
      </Button>
      {verify>0?<Form/>:<Typography variant="h5">Not Verified</Typography>}
    </Box>
  );
};

export default Connect;