import { ethers } from "ethers"
import hschain from 'hschainjs'

let Wallet = function(chain) {
	this.chain = chain;
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

export default {
	create:create
}