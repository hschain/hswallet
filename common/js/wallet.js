import { ethers } from "@/common/js/ethers.js"
import hschain from 'hschainjs'
import abi from "@/common/js/abi"
import util from '@/common/js/util.js'

const bech32    = require('bech32')
const ripemd160 = require('ripemd160')
const crypto    = require('crypto')
const secp256k1 = require('secp256k1')

const HSC_URL = 'https://scan.hschain.io'
const HSC_CHAIN = 'hschain'

let Wallet = function(chain) {
	this.chain = chain;
	this.provider = new ethers.providers.JsonRpcProvider('http://47.242.155.204:8545')
}

function create(chain) {
	return new Wallet(chain)
}

/**
 * 生成地址
 * 
 * @param String identifier	标识符，助记词或私钥
 * @param String type		标识符类型，表明是由助记词或私钥生成
 */
Wallet.prototype.getAddress = function(identifier, type) {
	if (this.chain == "HST") {
		if (type == 'privateKey') {
			const privateKey =  Buffer.from(identifier, 'hex');
			const publicKey = secp256k1.publicKeyCreate(privateKey);			
			
			const hash = crypto.createHash('sha256')
				.update(publicKey)
				.digest();

			const address = new ripemd160().update(hash).digest();
			const words   = bech32.toWords(address);

			return bech32.encode("hsc", words);			
		}
		
		return hschain.network(HSC_URL, HSC_CHAIN).getAddress(identifier)
	}
	
	if (this.chain == "ETH") {
		if (type == 'privateKey') {
			return new ethers.Wallet(identifier).address
		}
		
		return ethers.Wallet.fromMnemonic(identifier).address
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
Wallet.prototype.sendETH = function(mnemonic, targetAddress, amount,type) {
	amount = ethers.utils.parseEther(amount)
	targetAddress = ethers.utils.getAddress(targetAddress)

	let wallet
	if (type=='mnemonic') {
		wallet = ethers.Wallet.fromMnemonic(mnemonic)
	} else if(type=='privateKey'){
		wallet = new ethers.Wallet(mnemonic)
	}
	 
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
Wallet.prototype.sendToken = function(mnemonic, contractAddress, targetAddress, amount,type) {
	amount = ethers.utils.parseUnits(amount, util.getDecimal(contractAddress))
	targetAddress = ethers.utils.getAddress(targetAddress)
	
	let wallet
	if (type=='mnemonic') {
		wallet = ethers.Wallet.fromMnemonic(mnemonic)
	} else if(type=='privateKey'){
		wallet = new ethers.Wallet(mnemonic)
	}
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