let CryptoJS = require('crypto-js'); // 引入AES源码js
export default {
	/*
	* 对密码进行加密
	* @param {String}   word  需要加密的内容
	* @param {String}   keyStr  对内容加密的秘钥
	* @return {String}   加密的密文
	* */
	encrypt(word, keyStr) { // 加密
		keyStr = keyStr ? keyStr : 'HSCHAINABGHNJHGSHUYG12';
		//加密数据
		let encJson = CryptoJS.AES.encrypt(JSON.stringify(word), keyStr).toString()
		//将字符串先转换为utf8字符数组，再转换为base64数据
		return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson))
	},
	/*
	* @param {String}   word  需要解密的内容
	* @param {String}   keyStr  对内容解密的秘钥
	* @return {String}   解密的明文
	* */
	decrypt(word, keyStr) { // 解密
		keyStr = keyStr ? keyStr : 'HSCHAINABGHNJHGSHUYG12';
		let decData = CryptoJS.enc.Base64.parse(word).toString(CryptoJS.enc.Utf8)
		console.log(CryptoJS.AES.decrypt(decData, keyStr).toString(CryptoJS.enc.Utf8));
		console.log(JSON.parse(CryptoJS.AES.decrypt(decData, keyStr).toString(CryptoJS.enc.Utf8)));
		return JSON.parse(CryptoJS.AES.decrypt(decData, keyStr).toString(CryptoJS.enc.Utf8))
	},
};