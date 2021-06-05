import { ethers } from "@/common/js/ethers.js"
import hschain from 'hschainjs'
import abi from "@/common/js/abi"
import util from '@/common/js/util.js'

const bech32    = require('bech32')
const ripemd160 = require('ripemd160')
const crypto    = require('crypto')
const secp256k1 = require('secp256k1')

const HSC_CHAIN = 'hschain'	// 正式环境放开
// const HSC_CHAIN = 'test'	// 测试环境放开

const HSC_URL = 'https://scan.hschain.io'	// 正式环境放开
// const HSC_URL = 'https://testnet.hschain.io/'	// 测试环境放开

const hecoUrl = 'https://api.hecoinfo.com/api';		// heco正式环境放开
// const hecoUrl = 'https://api-testnet.hecoinfo.com/api';		// heco测试环境放开

const BinanceUrl = 'https://api.bscscan.com/api';		// Binance正式环境放开
// const BinanceUrl = 'https://api-testnet.bscscan.com/api';		// Binance测试环境放开

const HSCToHecoAddr = 'hsc1puw3fthwskj7s9uvrgswvagzx7md7kdrn3jket';		// hst钱包hsc转heco钱包hsc正式环境放开
// const HSCToHecoAddr = 'hsc1g75290c78q4euacv5n0yk24sh2uapmwx33w4ef';		// hst钱包hsc转heco钱包hsc测试环境放开

const HSCToBinanceAddr = 'hsc1xmhu5svjvv5s5ws5m06dmau3azt8fn4xcsmtt6';		// hst钱包hsc转Binance钱包hsc正式环境放开
// const HSCToBinanceAddr = 'hsc1acp7mclycgqvae2t99s2wymutyyg7e7tkwr25z';		// hst钱包hsc转Binance钱包hsc测试环境放开


let Wallet = function(chain) {
	this.chain = chain;

	if(chain == 'ETH'){
		this.provider = new ethers.providers.JsonRpcProvider('http://47.242.155.204:8545')
	}else if(chain == 'HECO'){
		// this.provider = new ethers.providers.JsonRpcProvider('https://http-testnet.hecochain.com'); // 测试网
		this.provider = new ethers.providers.JsonRpcProvider('https://http-mainnet-node.huobichain.com'); // 正式网
	}else if(chain == 'Binance'){
		// this.provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s2.binance.org:8545/') // 测试网
		this.provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed1.binance.org') // 正式网
	}
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
	
	// 火币
	if (this.chain == "HECO") {
		if (type == 'privateKey') {
			return new ethers.Wallet(identifier).address
		}
		
		return ethers.Wallet.fromMnemonic(identifier).address
	}
	
	// Binance
	if (this.chain == "Binance") {
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

Wallet.prototype.getHecoBalance = function(address,contractAddress) {
	const contract = new ethers.Contract(contractAddress, abi["hecoWhsc"], this.provider)
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
 * @param String mnemonic			助记词
 * @param String contractAddress	合约地址
 * @param String targetAddress		目标地址
 * @param Number amount				金额
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
 * HRC20 转账
 * 
 * @param String mnemonic			助记词
 * @param String contractAddress	合约地址
 * @param String targetAddress		目标地址
 * @param Number amount				金额
 */
Wallet.prototype.sendHscToken = function(mnemonic, targetAddress, amount,type) {
	// let contractAddress = '0xDB073D4Ff4bF9A8BE2900EdDc43e4206269331e8'; // 测试环境合约地址
	let contractAddress = '0x18F801fd8B8E7821E0C52Cf4739D76520e965a21'; // 正式环境合约地址
	
	amount = ethers.utils.parseUnits(amount, util.getHscDecimal(contractAddress))
	targetAddress = ethers.utils.getAddress(targetAddress)
	console.log(amount)
	console.log(targetAddress)
	
	let wallet
	if (type=='mnemonic') {
		wallet = ethers.Wallet.fromMnemonic(mnemonic)
	} else if(type=='privateKey'){
		wallet = new ethers.Wallet(mnemonic)
	}
	let activeWallet = wallet.connect(this.provider)
	
	let contractWithSigner = new ethers.Contract(contractAddress, abi['hecoWhsc'], activeWallet)	
	
	return contractWithSigner.transfer(targetAddress, amount)
}


/**
 * BEP-20 转账
 * 
 * @param String mnemonic			助记词
 * @param String contractAddress	合约地址
 * @param String targetAddress		目标地址
 * @param Number amount				金额
 */
Wallet.prototype.sendBinanceToken = function(mnemonic, targetAddress, amount,type) {
	// let contractAddress = '0x825F5256Aef3FeC35b97B8F1Ba57E971C4A59A27'; // 测试环境合约地址
	let contractAddress = '0x8b0b4aFc40a028aa002a6DB52EC268e8978EAC40'; // 正式环境合约地址
	
	amount = ethers.utils.parseUnits(amount, util.getHscDecimal(contractAddress))
	targetAddress = ethers.utils.getAddress(targetAddress)
	
	let wallet
	if (type=='mnemonic') {
		wallet = ethers.Wallet.fromMnemonic(mnemonic)
	} else if(type=='privateKey'){
		wallet = new ethers.Wallet(mnemonic)
	}
	let activeWallet = wallet.connect(this.provider)
	
	let contractWithSigner = new ethers.Contract(contractAddress, abi['hecoWhsc'], activeWallet)	
	
	return contractWithSigner.transfer(targetAddress, amount)
}


/**
 * 跨链转账 HECO -- HSC
 * 
 * @param String mnemonic			助记词
 * @param String contractAddress	合约地址
 * @param String targetAddress		目标地址
 * @param String toHecoSysAddress	heco固定地址
 * @param String myAddr				用户钱包地址
 * @param Number amount				金额
 */
Wallet.prototype.HecoBridgeHsc = function(mnemonic,myAddr, toHecoSysAddress, targetAddress, amount,type) {
	// let contractAddress = '0xc1Cc80226A84dF10e91F022Fc4e669A6b3172e09'; // ljh合约地址
	// let contractAddress = '0xDB073D4Ff4bF9A8BE2900EdDc43e4206269331e8'; // 测试环境合约地址
	let contractAddress = '0x18F801fd8B8E7821E0C52Cf4739D76520e965a21'; // 正式环境合约地址
	
	amount = ethers.utils.parseUnits(amount, util.getHscDecimal(contractAddress))
	//targetAddress = ethers.utils.getAddress(targetAddress)
	toHecoSysAddress = ethers.utils.getAddress(toHecoSysAddress)
	
	let wallet
	if (type=='mnemonic') {
		wallet = ethers.Wallet.fromMnemonic(mnemonic)
	} else if(type=='privateKey'){
		wallet = new ethers.Wallet(mnemonic)
	}

	let activeWallet = wallet.connect(this.provider)
	
	let contractWithSigner = new ethers.Contract(contractAddress, abi['hecoWhsc'], activeWallet)
	
	return contractWithSigner.bridge(toHecoSysAddress,targetAddress, amount)

}


/**
 * 跨链转账 Binance -- HSC
 * 
 * @param String mnemonic			助记词
 * @param String contractAddress	合约地址
 * @param String targetAddress		目标地址
 * @param String toHecoSysAddress	heco固定地址
 * @param String myAddr				用户钱包地址
 * @param Number amount				金额
 */
Wallet.prototype.BinanceBridgeHsc = function(mnemonic,myAddr, toBinanceSysAddress, targetAddress, amount,type) {
	// let contractAddress = '0xc1Cc80226A84dF10e91F022Fc4e669A6b3172e09'; // ljh合约地址
	// let contractAddress = '0x825F5256Aef3FeC35b97B8F1Ba57E971C4A59A27'; // 测试环境合约地址
	let contractAddress = '0x8b0b4aFc40a028aa002a6DB52EC268e8978EAC40'; // 正式环境合约地址
	
	amount = ethers.utils.parseUnits(amount, util.getHscDecimal(contractAddress))
	//targetAddress = ethers.utils.getAddress(targetAddress)
	toBinanceSysAddress = ethers.utils.getAddress(toBinanceSysAddress)
	
	let wallet
	if (type=='mnemonic') {
		wallet = ethers.Wallet.fromMnemonic(mnemonic)
	} else if(type=='privateKey'){
		wallet = new ethers.Wallet(mnemonic)
	}

	let activeWallet = wallet.connect(this.provider)
	
	let contractWithSigner = new ethers.Contract(contractAddress, abi['hecoWhsc'], activeWallet)
	
	return contractWithSigner.bridge(toBinanceSysAddress,targetAddress, amount)

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

// export default {
// 	create:create,
// 	HSC_CHAIN:HSC_CHAIN
// }
module.exports = {
	create,
	HSC_CHAIN,
	hecoUrl,
	BinanceUrl,
	HSCToHecoAddr,
	HSCToBinanceAddr
}