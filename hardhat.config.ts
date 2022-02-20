import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("verifyFactory", "Verify Greeter Factory contract")
  .addPositionalParam("contractAddress")
  .setAction(async (taskArgs, hre) => {
    await hre.run("verify:verify", {
      address: taskArgs.contractAddress,
    });
  });

task("deployGreeter", "Deploy Greeter using factory contract")
  .addPositionalParam("contractAddress")
  .addPositionalParam("greeter")
  .setAction(async (taskArgs, hre) => {
    const greeterFactory = await hre.ethers.getContractAt(
      "GreeterFactory",
      taskArgs.contractAddress
    );

    const contractTransaction = await greeterFactory.deployGreeter(
      taskArgs.greeter
    );
    const contractReceipt = await contractTransaction.wait();

    console.log("Greeter deployed to:", contractReceipt.events![0].args![0]);
  });

task("verifyGreeter", "Verify Greeter contract")
  .addPositionalParam("contractAddress")
  .addPositionalParam("greeter")
  .setAction(async (taskArgs, hre) => {
    await hre.run("verify:verify", {
      address: taskArgs.contractAddress,
      constructorArguments: [taskArgs.greeter],
    });
  });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
