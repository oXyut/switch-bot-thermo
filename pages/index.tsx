import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { Grid, Typography, Stack, Container, Icon} from '@mui/material'
import ThermostatIcon from '@mui/icons-material/Thermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import {red, blue, grey} from '@mui/material/colors';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createReadStream } from 'fs'
import { textAlign } from '@mui/system'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const apiKey = process.env.FIREBASE_CONFIG_API_KEY;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "switch-bot-thero.firebaseapp.com",
  projectId: "switch-bot-thero",
  storageBucket: "switch-bot-thero.appspot.com",
  messagingSenderId: "18830338909",
  appId: "1:18830338909:web:94a25c409f3aed527d96b4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const inter = Inter({ subsets: ['latin'] });

type DeviceInfo = {
    deviceId: string,
    deviceType: string,
    hubDeviceId: string,
    humidity: number,
    temperature: number,
    version: string,
    battery: number
}

export default function Home() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)

  const fetchDeviceInfo = async () => {
    // axios.get(`/api/switchbotAPI`)
    axios.get(`https://us-central1-switch-bot-thero.cloudfunctions.net/fetchThermoInfo`)
    .then(res => {
      console.log("success");
      console.log(res.data);
      const info = res.data;
      setDeviceInfo(info);
    }).catch(err => {
      console.log("error");
      console.log(err);
    })
  }

  useEffect(() => {
    fetchDeviceInfo();
  }, [])


  return (
    <>
      <Head>
        <title>A621温湿度計</title>
        <meta name="description" content="A621の温度と湿度を確認できるwebページです" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Stack spacing={2} sx={{width: '100%'}}>
          <Typography variant="h5" component="h5" color={grey[500]} sx={{ mb: 2 }} align="center">
            A621 温湿度計
          </Typography>
          <Typography variant="h5" component="h5" color={red[500]} textAlign="center">
            <Icon sx={{marginRight:'8px'}}>
              <ThermostatIcon sx={{ color: red[500] }} />
            </Icon>
            {deviceInfo?.temperature} ℃
          </Typography>
          <Typography variant="h5" component="h5" color={blue[500]} textAlign="center">
            <Icon sx={{marginRight:'8px'}}>
              <OpacityIcon sx={{ color: blue[500] }} />
            </Icon>
            {deviceInfo?.humidity} %
          </Typography>
        </Stack>
      </Container>
      </main>
    </>
  )
}
