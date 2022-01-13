import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
      
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

export default function CustomizedAccordions() {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div>
      <Accordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>How to buy Solana ?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography align={'left'}>
          Solana also known as SOL is a cryptocurrency. This project will be on the Solana Blockchain. As a newbie in the crypto space we recommend that you sign up to Binance.com on your desktop.
            <ol>
                <li>You will need to buy Solana first using your local currency (USD, HKD, GBP etc)</li>
                <li>Click on "Buy Now" on the home page</li>
                <li>Select your local currency (in the example below I selected USD) on "Spend" and select "USDT" for "Receive". Select the amount you want to spend on our NFT. Then click continue.</li>
                <li>Once you have USDT, click on "convert"</li>
                <li>Here, you will need to convert your USDT to Solana (SOL) &rarr click "Preview Conversion" and proceed.</li>
                <li>Then Congrats! you now have Solana (SOL) to buy your first NFT!</li>
            </ol>
            Here's how to send Solana from your Binance wallet to your Phantom wallet:
            <ol>
                <li>Create a Phantom wallet https://phantom.app and add it to your Chrome (Phantom wallet is a Solana wallet, it is only available on your desktop for now, they will launch on mobile early next year - now you know how early you are in this space! is going to explode!)</li>
                <li>In your Phantom wallet, you can click on the long number at the top (which is your unique ID of your wallet) and it will automatically copy the number</li>
                <li>Go back on your Binance, click on "Wallet" - "Overview" - "Withdraw" Select coin, select "SOL"
                    <ul>
                    <li>Address, make sure to paste your Phantom wallet address here (double check)</li>
                    <li>Network, make sure to select "SOL" as the network</li>
                    <li>Select the amount of SOL you want to withdraw and then click withdraw</li>
                    </ul>
                </li>
                <li>Give it a few seconds/sometimes minutes, and check your Phantom wallet. Your SOL should be available on your Phantom wallet now!</li>
                <li>Head over the secondary markets and buy your favourite Kittens!</li>
            </ol>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography>Collapsible Group Item #2</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion square expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography>Collapsible Group Item #3</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}