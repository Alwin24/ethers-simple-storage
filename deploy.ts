import { ContractFactory, providers, Wallet } from "ethers"
import { readFileSync } from "fs"
import dotenv from "dotenv"

dotenv.config()

const main = async () => {
    const provider = new providers.JsonRpcProvider(process.env.RPC_URL!)
    const wallet = new Wallet(process.env.PRIVATE_KEY!, provider)

    const abi = readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8")

    const contractFactory = new ContractFactory(abi, binary, wallet)
    console.log("Deploying, please wait...")
    const contract = await contractFactory.deploy()

    await contract.deployTransaction.wait(1)
    console.log(`Contract deployed to ${contract.address}`)

    let favoriteNumber = await contract.retrieve()
    console.log(`Current favorite number : ${favoriteNumber.toString()}`)

    const txnResponse = await contract.store("24")
    const txnReciept = await txnResponse.wait(1)

    favoriteNumber = await contract.retrieve()
    console.log(`Updated favorite number : ${favoriteNumber.toString()}`)

}

main()
