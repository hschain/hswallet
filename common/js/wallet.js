import { ethers } from "@/common/js/ethers.js"
import hschain from 'hschainjs'
import abi from "@/common/js/abi"

let Wallet = function(chain) {
	this.chain = chain;
	this.provider = new ethers.providers.JsonRpcProvider('http://47.242.155.204:8545')
}

function create(chain) {
	return new Wallet(chain)
}

Wallet.prototype.getAddress = function(mnemonic) {
	if (this.chain == "HST") {
		return hschain.network('https://testnet.hschain.io/', 'hst01').getAddress(mnemonic)
	}
	
	if (this.chain == "ETH") {
		return ethers.Wallet.fromMnemonic(mnemonic).address
	}
}

//读资产
Wallet.prototype.getBalance = function(address) {
	return this.provider.getBalance(address)
}

Wallet.prototype.getTokenBalance = function(address, token) {
	const contract = new ethers.Contract(token, abi["ERC20"], this.provider)
	return contract.balanceOf(address)
}

/**
 * eth 转账
 * @param string mnemonic 助记词
 * @param string targetAddress 目标地址
 * @param number amount 金额
 */
Wallet.prototype.sendETH = function(mnemonic, targetAddress, amount) {
	amount = ethers.utils.parseEther(amount)
	targetAddress = ethers.utils.getAddress(targetAddress)
	
	let wallet = ethers.Wallet.fromMnemonic(mnemonic)
	let activeWallet = wallet.connect(this.provider)
	
	return activeWallet.sendTransaction({
		to: targetAddress,
		value: amount		
	})
}

/**
 * ERC20 转账
 * 
 * @param String mnemonic					助记词
 * @param String contractAddress	合约地址
 * @param String targetAddress		目标地址
 * @param Number amount						金额
 */
Wallet.prototype.sendToken = function(mnemonic, contractAddress, targetAddress, amount) {
	amount = ethers.utils.parseEther(amount)
	targetAddress = ethers.utils.getAddress(targetAddress)
	
	let wallet = ethers.Wallet.fromMnemonic(mnemonic)
	let activeWallet = wallet.connect(this.provider)
	
	let contractWithSigner = new ethers.Contract(contractAddress, abi['ERC20'], activeWallet)	
	
	return contractWithSigner.transfer(targetAddress, amount)
}

/**
 * 获取代币精度
 * 
 * @param {Object} contractAddress
 */
Wallet.prototype.getDecimal = function(contractAddress) {
	let contract = new ethers.Contract(contractAddress, abi['ERC20'], this.provider)
	return contract.decimals()
}

export default {
	create:create
}