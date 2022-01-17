import { useEffect, useState } from "react";
import styled from "styled-components";
import confetti from "canvas-confetti";
import * as anchor from "@project-serum/anchor";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-material-ui";
import { GatewayProvider } from "@civic/solana-gateway-react";
import Countdown from "react-countdown";
import { Snackbar, Paper, LinearProgress, Chip } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { toDate, AlertState, getAtaForMint } from "./utils";
import { MintButton } from "./MintButton";
import BasicImageList from "./ImageGallery";
import CustomizedTimeline from "./Timeline";
import CustomizedAccordions from "./FAQView";
import Button from "@material-ui/core/Button";
import { SocialIcon } from "react-social-icons";
import {
  ScrollingProvider,
  useScrollSection,
  Section,
} from 'react-scroll-section';
import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  CANDY_MACHINE_PROGRAM,
} from "./candy-machine";

const cluster = process.env.REACT_APP_SOLANA_NETWORK!.toString();

const WalletContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-left: 5%;
  margin-right: 5%;
`;
const NFT1 = styled.div`
  min-width: 400px;
  padding: 0px;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const NFT2 = styled.div`
  min-width: 400px;
  padding: 0px;
  flex: 1;
  align-items: center;
  justify-content: center;
  color: black;
  margin-top: auto;
  margin-bottom: auto;
`;

const SectionTitle = styled.h1`
  color: black;
  margin-top: 36px;
  margin-bottom: 0px;
`;

const SectionSubtitle = styled.h3`
  margin-top: 16px;
  margin-bottom: 24px;
  color: var(--card-background-lighter-color);
`;

const Card = styled(Paper)`
  display: inline-block;
  background-color: var(--card-background-lighter-color) !important;
  margin: 5px;
  padding: 24px;
`;

const MintButtonContainer = styled.div`
  button.MuiButton-contained:not(.MuiButton-containedPrimary).Mui-disabled {
    color: #464646;
  }

  button.MuiButton-contained:not(.MuiButton-containedPrimary):hover,
  button.MuiButton-contained:not(.MuiButton-containedPrimary):focus {
    -webkit-animation: pulse 1s;
    animation: pulse 1s;
    box-shadow: 0 0 0 2em rgba(255, 255, 255, 0);
  }

  @-webkit-keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 #ef8f6e;
    }
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 #ef8f6e;
    }
  }
`;

const WalletAmount = styled.div`
  color: var(--menu-text-color);
  width: auto;
  height: 48px;
  padding: 0 5px 0 16px;
  min-width: 48px;
  min-height: auto;
  border-radius: 24px;
  background-color: var(--title-text-color);
  box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%),
    0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%);
  box-sizing: border-box;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  font-weight: 500;
  line-height: 1.75;
  text-transform: uppercase;
  border: 0;
  margin: 0;
  display: inline-flex;
  outline: 0;
  position: relative;
  align-items: center;
  user-select: none;
  vertical-align: middle;
  justify-content: flex-start;
  gap: 10px;
`;

const NavContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
  justify-content: center;
  margin-top: 8px;
  margin-bottom: 24px;
  margin-left: auto;
  margin-right: auto;

  li {
    cursor: pointer;
    margin: 0 20px;
    color: var(--menu-text-color);
    list-style-image: none;
    list-style-position: outside;
    list-style-type: none;
    outline: none;
    text-decoration: none;
    text-size-adjust: 100%;
    touch-action: manipulation;
    transition: color 0.3s;
    padding-bottom: 15px;
  }

  li:hover,
  li:active {
    color: rgb(200, 154, 120);
    padding-bottom: 11px;
    border-bottom: 4px solid var(--title-text-color);
  }
`;

const SocialMediaContainer = styled.div`
  display: inline-flex;
  flex-direction: row;
  flex: 1 1 auto;
  justify-content: center;
`;

const SocialMediaButton = styled(Button)`
  display: block !important;
  margin: 8px 8px !important;
  background-color: var(--title-text-color) !important;
  font-size: 1.2em;
`;

const BannerContainer = styled.div`
  height: auto;
  padding: 32px 32px;
  background-color: var(--card-background-color);
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;

  h3 {
    color: black;
    font-weight: 700;
    margin-left: 64px;
    margin-right: 64px;
  }
  h4 {
    color: black;
    font-weight: 600;
    margin-left: 64px;
    margin-right: 64px;
  }
`;

const ConnectButton = styled(WalletMultiButton)``;
const Logo = styled.div`
  flex: 0 0 auto;

  img {
    height: 60px;
  }
`;
const Menu = styled.ul`
  list-style: none;
  display: inline-flex;
  flex: 1 0 auto;

  li {
    margin: 0 20px;

    a {
      color: var(--menu-text-color);
      list-style-image: none;
      list-style-position: outside;
      list-style-type: none;
      outline: none;
      text-decoration: none;
      text-size-adjust: 100%;
      touch-action: manipulation;
      transition: color 0.3s;
      padding-bottom: 15px;

      img {
        max-height: 26px;
      }
    }

    a:hover,
    a:active {
      color: rgb(200, 154, 120);
      border-bottom: 4px solid var(--title-text-color);
    }
  }
`;

const SolExplorerLink = styled.a`
  color: var(--title-text-color);
  border-bottom: 1px solid var(--title-text-color);
  font-weight: bold;
  list-style-image: none;
  list-style-position: outside;
  list-style-type: none;
  outline: none;
  text-decoration: none;
  text-size-adjust: 100%;

  :hover {
    border-bottom: 2px solid var(--title-text-color);
  }
`;

const Wallet = styled.ul`
  flex: 0 0 auto;
  margin: 0;
  padding: 0;
`;
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
  justify-content: center;
`;

const MintContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
  flex-wrap: wrap;
//   gap: 20px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1080px;
  background-color: var(--card-background-color);
`;

const DesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
//   gap: 20px;
`;

const Price = styled(Chip)`
  position: absolute;
  margin: 5px;
  font-weight: bold;
  font-size: 1em !important;
`;

const Image = styled.img`
  height: auto;
  width: 100%;
  object-fit: cover;
`;

const BorderLinearProgress = styled(LinearProgress)`
  margin: 20px 0;
  height: 10px !important;
  border-radius: 5px;
`;

const GoldTitle = styled.h1`
  color: var(--title-text-color);
  animation: glow 2s ease-in-out infinite alternate;
  color: var(--title-text-color);
  @keyframes glow {
    from {
      text-shadow: 0 0 20px var(--card-background-color);
    }
    to {
      text-shadow: 0 0 30px var(--card-background-color), 0 0 10px yellow;
    }
  }
`;

const LogoAligner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-height: 64px;
    margin-right: 12px;
  }
`;

const StaticMenu = () => {
  const mintSection = useScrollSection('mint');
  const gallerySection = useScrollSection('gallery');
  const roadmapSection = useScrollSection('roadmap');
  const faqSection = useScrollSection('faq');

  return (
    <NavContainer>
      <Menu>
        <li onClick={mintSection.onClick}>
          Mint
        </li>
        <li onClick={gallerySection.onClick}>
          Gallery
        </li>
        <li onClick={roadmapSection.onClick}>
          Roadmap
        </li>
        <li onClick={faqSection.onClick}>
          FAQ
        </li>
      </Menu>
    </NavContainer>
  );
};

export interface HomeProps {
  candyMachineId: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  txTimeout: number;
  rpcHost: string;
}

const Home = (props: HomeProps) => {
  const [balance, setBalance] = useState<number>();
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT
  const [isActive, setIsActive] = useState(false); // true when countdown completes or whitelisted
  const [solanaExplorerLink, setSolanaExplorerLink] = useState("");
  const [itemsAvailable, setItemsAvailable] = useState(0);
  const [itemsRedeemed, setItemsRedeemed] = useState(0);
  const [itemsRemaining, setItemsRemaining] = useState(0);
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [price, setPrice] = useState(0);
  const [whitelistPrice, setWhitelistPrice] = useState(0);
  const [whitelistEnabled, setWhitelistEnabled] = useState(false);
  const [whitelistTokenBalance, setWhitelistTokenBalance] = useState(0);

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const wallet = useAnchorWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();

  const rpcUrl = props.rpcHost;

  const refreshCandyMachineState = () => {
    (async () => {
      if (!wallet) return;

      const cndy = await getCandyMachineState(
        wallet as anchor.Wallet,
        props.candyMachineId,
        props.connection
      );

      setCandyMachine(cndy);
      setItemsAvailable(cndy.state.itemsAvailable);
      setItemsRemaining(cndy.state.itemsRemaining);
      setItemsRedeemed(cndy.state.itemsRedeemed);
      setPrice(cndy.state.price.toNumber() / LAMPORTS_PER_SOL);
      setWhitelistPrice(cndy.state.price.toNumber() / LAMPORTS_PER_SOL);

      // fetch whitelist token balance
      if (cndy.state.whitelistMintSettings) {
        setWhitelistEnabled(true);
        if (
          cndy.state.whitelistMintSettings.discountPrice !== null &&
          cndy.state.whitelistMintSettings.discountPrice !== cndy.state.price
        ) {
          setWhitelistPrice(
            cndy.state.whitelistMintSettings.discountPrice?.toNumber() /
              LAMPORTS_PER_SOL
          );
        }
        let balance = 0;
        try {
          const tokenBalance = await props.connection.getTokenAccountBalance(
            (
              await getAtaForMint(
                cndy.state.whitelistMintSettings.mint,
                wallet.publicKey
              )
            )[0]
          );

          balance = tokenBalance?.value?.uiAmount || 0;
        } catch (e) {
          console.error(e);
          balance = 0;
        }
        setWhitelistTokenBalance(balance);
        setIsActive(balance > 0);
      } else {
        setWhitelistEnabled(false);
      }
    })();
  };

  const renderCounter = ({ days, hours, minutes, seconds }: any) => {
    return (
      <div>
        <Card elevation={1}>
          <h1>{days}</h1>
          <br />
          Days
        </Card>
        <Card elevation={1}>
          <h1>{hours}</h1>
          <br />
          Hours
        </Card>
        <Card elevation={1}>
          <h1>{minutes}</h1>
          <br />
          Mins
        </Card>
        <Card elevation={1}>
          <h1>{seconds}</h1>
          <br />
          Secs
        </Card>
      </div>
    );
  };

  function displaySuccess(mintPublicKey: any): void {
    let remaining = itemsRemaining - 1;
    setItemsRemaining(remaining);
    setIsSoldOut(remaining === 0);
    if (whitelistTokenBalance && whitelistTokenBalance > 0) {
      let balance = whitelistTokenBalance - 1;
      setWhitelistTokenBalance(balance);
      setIsActive(balance > 0);
    }
    setItemsRedeemed(itemsRedeemed + 1);
    const solFeesEstimation = 0.012; // approx
    if (balance && balance > 0) {
      setBalance(
        balance -
          (whitelistEnabled ? whitelistPrice : price) -
          solFeesEstimation
      );
    }
    setSolanaExplorerLink(
      cluster == "devnet" || cluster == "testnet"
        ? "https://explorer.solana.com/address/" +
            mintPublicKey +
            "?cluster=" +
            cluster
        : "https://explorer.solana.com/address/" + mintPublicKey
    );
    throwConfetti();
  }

  function throwConfetti(): void {
    confetti({
      particleCount: 400,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  const onMint = async () => {
    try {
      setIsMinting(true);
      document.getElementById("#identity")?.click();
      if (wallet && candyMachine?.program && wallet.publicKey) {
        const mint = anchor.web3.Keypair.generate();
        const mintTxId = (
          await mintOneToken(candyMachine, wallet.publicKey, mint)
        )[0];

        let status: any = { err: true };
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            props.txTimeout,
            props.connection,
            "singleGossip",
            true
          );
        }

        if (!status?.err) {
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });

          // update front-end amounts
          displaySuccess(mint.publicKey);
        } else {
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      // TODO: blech:
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (!error.message) {
          message = "Transaction Timeout! Please try again.";
        } else if (error.message.indexOf("0x138")) {
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setIsMinting(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, props.connection]);

  useEffect(refreshCandyMachineState, [
    wallet,
    props.candyMachineId,
    props.connection,
  ]);

  return (
    <main><ScrollingProvider>
      <MainContainer>
        <WalletContainer>
          <Logo>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img alt="" src="logo.png" />
            </a>
          </Logo>
          <Menu>
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Discover
              </a>
            </li>
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Collections
              </a>
            </li>
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Tutorial
              </a>
            </li>
          </Menu>
          <Wallet>
            {wallet ? (
              <WalletAmount>
                {(balance || 0).toLocaleString()} SOL
                <ConnectButton />
              </WalletAmount>
            ) : (
              <ConnectButton>Connect Wallet</ConnectButton>
            )}
          </Wallet>
        </WalletContainer>

        <BannerContainer>
          <LogoAligner>
            <img src="logo.png" alt=""></img>
            <GoldTitle>Alienated</GoldTitle>
          </LogoAligner>
          <h3>This is the description of the NFT collection</h3>
          <SocialMediaContainer>
            <SocialMediaButton size={"large"}>
              <SocialIcon
                network="twitter"
                fgColor="#FFFFFF"
                style={{ height: 32, width: 32 }}
              />{" "}
              Twitter
            </SocialMediaButton>
            <SocialMediaButton size={"large"}>
              <SocialIcon
                network="discord"
                fgColor="#FFFFFF"
                style={{ height: 32, width: 32 }}
              />{" "}
              Discord
            </SocialMediaButton>
            <SocialMediaButton size={"large"}>
              <SocialIcon
                network="instagram"
                fgColor="#FFFFFF"
                style={{ height: 32, width: 32 }}
              />{" "}
              Instagram
            </SocialMediaButton>
          </SocialMediaContainer>
          <h4>
            This is the description of the NFT collection. This is the
            description of the NFT collection. This is the description of the
            NFT collection. This is the description of the NFT collection. This
            is the description of the NFT collection.
          </h4>
        </BannerContainer>

        <StaticMenu/>

        <Section id="mint">
        <MintContainer>
          <DesContainer>
            <NFT1>
              <div>
                <Price
                  label={
                    isActive && whitelistEnabled && whitelistTokenBalance > 0
                      ? whitelistPrice + " SOL"
                      : price + " SOL"
                  }
                />
                <Image src="logo.gif" alt="NFT To Mint" />
              </div>
              <br />
              
            </NFT1>
            <NFT2>
            {wallet &&
                isActive &&
                whitelistEnabled &&
                whitelistTokenBalance > 0 && (
                  <h3>
                    You have {whitelistTokenBalance} whitelist mint(s)
                    remaining.
                  </h3>
                )}
              {wallet && isActive && (
                /* <p>Total Minted : {100 - (itemsRemaining * 100 / itemsAvailable)}%</p>}*/
                <h3>
                  TOTAL MINTED : {itemsRedeemed} / {itemsAvailable}
                </h3>
              )}
              {wallet && isActive && (
                <BorderLinearProgress
                  variant="determinate"
                  value={100 - (itemsRemaining * 100) / itemsAvailable}
                />
              )}
              <br />
              <MintButtonContainer>
                {!isActive && candyMachine?.state.goLiveDate ? (
                  <Countdown
                    date={toDate(candyMachine?.state.goLiveDate)}
                    onMount={({ completed }) => completed && setIsActive(true)}
                    onComplete={() => {
                      setIsActive(true);
                    }}
                    renderer={renderCounter}
                  />
                ) : !wallet ? (
                  <ConnectButton>Connect Wallet</ConnectButton>
                ) : candyMachine?.state.gatekeeper &&
                  wallet.publicKey &&
                  wallet.signTransaction ? (
                  <GatewayProvider
                    wallet={{
                      publicKey:
                        wallet.publicKey ||
                        new PublicKey(CANDY_MACHINE_PROGRAM),
                      //@ts-ignore
                      signTransaction: wallet.signTransaction,
                    }}
                    // // Replace with following when added
                    // gatekeeperNetwork={candyMachine.state.gatekeeper_network}
                    gatekeeperNetwork={
                      candyMachine?.state?.gatekeeper?.gatekeeperNetwork
                    } // This is the ignite (captcha) network
                    /// Don't need this for mainnet
                    clusterUrl={rpcUrl}
                    options={{ autoShowModal: false }}
                  >
                    <MintButton
                      candyMachine={candyMachine}
                      isMinting={isMinting}
                      isActive={isActive}
                      isSoldOut={isSoldOut}
                      onMint={onMint}
                    />
                  </GatewayProvider>
                ) : (
                  <MintButton
                    candyMachine={candyMachine}
                    isMinting={isMinting}
                    isActive={isActive}
                    isSoldOut={isSoldOut}
                    onMint={onMint}
                  />
                )}
              </MintButtonContainer>
              <br />
              {wallet && isActive && solanaExplorerLink && (
                <SolExplorerLink href={solanaExplorerLink} target="_blank">
                  View on Solana Explorer
                </SolExplorerLink>
              )}
            </NFT2>
          </DesContainer>
        </MintContainer>
        </Section>

        <Section id="gallery">
          <SectionTitle>Gallery</SectionTitle>
          <SectionSubtitle>The finest NFT that your could mint</SectionSubtitle>
          <MintContainer>
              <BasicImageList/>
          </MintContainer>
        </Section>

        <Section id="roadmap">
          <SectionTitle>Roadmap</SectionTitle>
          <SectionSubtitle>Here is our vision to this NFT collection</SectionSubtitle>
          <MintContainer>
            <CustomizedTimeline/>
          </MintContainer>
        </Section>

        <Section id="faq">
          <SectionTitle>Frequently Asked Questions</SectionTitle>
          <SectionSubtitle>Here is our vision to this NFT collection</SectionSubtitle>
          <MintContainer>
              <CustomizedAccordions/>
          </MintContainer>
        </Section>

      </MainContainer>
      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </ScrollingProvider></main>
  );
};

export default Home;
