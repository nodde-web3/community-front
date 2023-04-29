import Head from "next/head";
import styles from "@/styles/Home.module.css";
import React, { useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import Link from "next/link";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Button } from "antd";
import {
  MAIN_NFT_ABI,
  MAIN_NFT_ADDRESS,
  WAIT_BLOCK_CONFIRMATIONS,
} from "@/constants";
import { BigNumber } from "ethers";
import { waitForTransaction } from "@wagmi/core";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [priceToMint, setPriceToMint] = useState<BigNumber | undefined>(
    undefined
  );
  const [userProfileId, setUserProfileId] = useState<number | undefined>(
    undefined
  );

  // It's a workaround,
  // details - https://ethereum.stackexchange.com/questions/133612/error-hydration-failed-because-the-initial-ui-does-not-match-what-was-rendered
  const [isDefinitelyConnected, setIsDefinitelyConnected] = useState(false);
  useEffect(() => {
    if (isConnected) {
      setIsDefinitelyConnected(true);
    } else {
      setIsDefinitelyConnected(false);
    }
  }, [isConnected]);

  /**
   * Loading price to mint
   */
  const { data: priceToMintData, isSuccess: isPriceToMintDataSuccess } =
    useContractRead({
      address: MAIN_NFT_ADDRESS,
      abi: MAIN_NFT_ABI,
      functionName: "priceToMint",
      args: [address],
    });

  useEffect(() => {
    if (isPriceToMintDataSuccess) {
      setPriceToMint(priceToMintData as BigNumber);
    }
  }, [priceToMintData, isPriceToMintDataSuccess]);

  /**
   * Loading address tokens.
   *
   * I can't find a way to check if a user has a profile, so it's a workaround.
   *
   * success => has profile
   * error => no profile
   */
  const {
    data: tokenOfOwnerByIndexData,
    isSuccess: isTokenOfOwnerByIndexSuccess,
    refetch: tokenOfOwnerByIndexRefetch,
  } = useContractRead({
    address: MAIN_NFT_ADDRESS,
    abi: MAIN_NFT_ABI,
    functionName: "tokenOfOwnerByIndex",
    args: [address, 0],
  });

  useEffect(() => {
    if (isTokenOfOwnerByIndexSuccess) {
      setUserProfileId(tokenOfOwnerByIndexData as number);
    } else {
      setUserProfileId(undefined);
    }
  }, [
    priceToMintData,
    isPriceToMintDataSuccess,
    isTokenOfOwnerByIndexSuccess,
    tokenOfOwnerByIndexData,
  ]);

  const { config: safeMintConfig } = usePrepareContractWrite({
    address: MAIN_NFT_ADDRESS,
    abi: MAIN_NFT_ABI,
    functionName: "safeMint",
    overrides: {
      value: priceToMint,
    },
  });

  const [isMinting, setIsMinting] = useState(false);
  const { writeAsync: safeMintWriteAsync } = useContractWrite(safeMintConfig);

  const mint = async () => {
    if (!priceToMint) {
      console.error("Can't load mint price.");
      return;
    }
    setIsMinting(true);
    safeMintWriteAsync?.().then((data) => {
      return waitForTransaction({
        hash: data.hash,
        confirmations: WAIT_BLOCK_CONFIRMATIONS,
      })
        .then((data) => {
          console.log(data);
        })
        .finally(() => {
          setIsMinting(false);
          // after minting we have to receive token by user again.
          tokenOfOwnerByIndexRefetch();
        });
    });
  };

  return (
    <>
      <Head>
        {/* TODO fix it*/}
        <title>Community</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Header
          saveCallback={undefined}
          editAvailable={false}
          edited={false}
          setEdited={undefined}
          disabled={false}
        />

        {/* <div className={styles.center}>
                    {
                        isDefinitelyConnected ?
                            (
                                userProfileId ?
                                    <Link href={`/profile/${userProfileId}`}>To profile</Link> :
                                    <Button loading={isMinting} onClick={mint}>Mint</Button>
                            )
                            :
                            <h2>Please connect wallet</h2>
                    }
                </div> */}

        <div className={styles.center}>
          <div className={styles.welcome_content}>
            <div className={styles.welcome_content_left_side}>
              <h1>Welcome to</h1>
              <div className={styles.logo_nodde}></div>
              Create a closed sessions for training, streams, and other events,
              as well as receive donations from subscribers.
            </div>
          </div>

          <Button
            className={styles.createProfileButton}
            loading={isMinting}
            onClick={mint}
          >
            Create a profile
          </Button>
          <h1>Build you own community</h1>
          <div className={styles.arrow}></div>
          <div className={styles.home_content}>
            <div className={styles.home_content_left_side}>
              Firstly, connect your wallet to the platform
            </div>
            <div className={styles.home_content_right_side}>
              <div
                className={`${styles.home_image} ${styles.home_image_1}`}
              ></div>
            </div>
          </div>
          <div className={styles.home_content}>
            <div className={styles.home_content_left_side}>
              <div
                className={`${styles.home_image} ${styles.home_image_2}`}
              ></div>
            </div>
            <div className={styles.home_content_right_side}>
              <div className={styles.home_right_side_text}>
                Click the "Create Profile" button and pay the registration fee
              </div>
            </div>
          </div>
          <div className={styles.home_content}>
            <div className={styles.home_content_left_side}>
              Fill out your profile, including your community name, photos,
              description, and other details
            </div>
            <div className={styles.home_content_right_side}>
              <div
                className={`${styles.home_image} ${styles.home_image_3}`}
              ></div>
            </div>
          </div>
          <div className={styles.home_content}>
            <div className={styles.home_content_left_side}>
              <div
                className={`${styles.home_image} ${styles.home_image_4}`}
              ></div>
            </div>
            <div className={styles.home_content_right_side}>
              <div className={styles.home_right_side_text}>
                Select the currencies for donations
              </div>
            </div>
          </div>
          <div className={styles.home_content}>
            <div className={styles.home_content_left_side}>
              Click the "Save" button to complete the registration
            </div>
            <div className={styles.home_content_right_side}>
              <div
                className={`${styles.home_image} ${styles.home_image_5}`}
              ></div>
            </div>
          </div>

          <Button
            className={styles.createProfileButton}
            loading={isMinting}
            onClick={mint}
          >
            Create a profile
          </Button>
        </div>

        <Footer />
      </main>
    </>
  );
}
