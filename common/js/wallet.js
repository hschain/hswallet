import { ethers } from "ethers"
import hschain from 'hschainjs'
import abi from "@/common/js/abi"

let Wallet = function(chain) {
	this.chain = chain;
	this.provider = ethers.getDefaultProvider("homestead");
}

function create(chain) {
	return new Wallet(chain);
}

Wallet.prototype.getAddress = function(mnemonic) {
	if (this.chain == "HST") {
		return hschain.network('https://testnet.hschain.io/', 'hst01').getAddress(mnemonic);
	}
	
	if (this.chain == "ETH") {
		return ethers.Wallet.fromMnemonic(mnemonic).address;
	}
}

Wallet.prototype.getBalance = function(address) {
	return this.provider.getBalance(address);
}

Wallet.prototype.getTokenBalance = function(address, token) {
	const contract = new ethers.Contract(token, abi["ERC20"], this.provider)
	return contract.balanceOf(address)
}

export default {
	create:create
}