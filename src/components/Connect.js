import Button from "@mui/material/Button";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Form from "./Form";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import Web3 from "web3";
import { ABI, CONTRACT_ADDRESS, CHAIN_ID } from "../constants";

//Creating custom pallete for theme
const theme =createTheme({
  palette: {
    neutral: {
      main: '#e82771',
      contrastText: '#ffff',
    },
  },
})

const Connect = () => {
  const [account, setAccount] = useState(null);
  const [verify, setVerify] = useState(0);
  const [connected, setConnected] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(true);

  let balance = 0;

  try {
    window.ethereum.on("accountsChanged", (accounts) => {
      setAccount(accounts[0]);
      setVerify(0);
    });
  } catch (error) {
    console.log("No ethereum");
  }

  const verifyBalance = async () => {
    setVerifying(true);
    if (window.ethereum) {
      await window.ethereum.send("eth_requestAccounts");
      window.web3 = new Web3(window.ethereum);
      var chain = await window.web3.eth.net.getId();
      if(CHAIN_ID === chain.toString()) {
        var contract = new window.web3.eth.Contract(ABI, CONTRACT_ADDRESS);
      var accounts = await window.web3.eth.getAccounts();
      setAccount(accounts[0]);
      if (account) {
        balance = Number(await contract.methods.balanceOf(account).call());
        if (balance > 0){
          setVerify(1);
          setVerificationStatus(true);
        }else{
          setVerificationStatus(false);
        }
        setVerifying(false);
      }
    }else{
      setVerifying(false);
      alert("Wrong chain");
    }
  }
};

  const conn = async () => {
    if (window.ethereum) {
      await window.ethereum.send("eth_requestAccounts");
      window.web3 = new Web3(window.ethereum);
      var accounts = await window.web3.eth.getAccounts();
      setAccount(accounts[0]);
      if(accounts[0]) setConnected(true);
    }else{
      window.alert("No wallet detected");
    }
  };

  return (
    <ThemeProvider theme={theme}>
    <Grid container spacing={2} alignContent={"center"}>
      <Grid item xs={12}>
        <Button  onClick={conn} color = "neutral" size="large" variant="contained">
          {connected ? "Connected" : "Connect"}
        </Button>
      </Grid>
      <Grid item xs={12}>
        {verify > 0 ? (
          <Form />
        ) : account ? (
          <Grid container>
            <Grid item xs={12}  marginTop={15}>
              <Button variant="contained" onClick={verifyBalance} size="large" color = "neutral">
                Verify Assets
              </Button>
              { verificationStatus?
              null:
              (<Typography variant="h4" component="h4" sx={{color:"White"}} marginTop={5}>Unauthorized access! You don't hold the NFT.</Typography>)
              }
            </Grid>
            <Grid item xs={12} marginTop={7}>
              {verifying ? <CircularProgress color="neutral" /> : null}
            </Grid>
          </Grid>
        ) : null}
      </Grid>
    </Grid>  
    </ThemeProvider>
    
  );
};

export default Connect;
