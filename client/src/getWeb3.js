import Web3 from "web3";

const getWeb3 = () =>
    new Promise((resolve, reject) => {
        //ページの初期表示時に実行する
        window.addEventListener('load', () => {
            let web3 = window.web3;

            const alreadyInjected = typeof web3 !== "undefined";

            if (alreadyInjected) {
                //metamaskを利用する
                web3 = new Web3(web3.currentProvider);
                resolve(web3);
            } else {
                //gethなどのプライベートネットを利用する
                web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
                resolve(web3);
                console.log("No web3.");
            }
        });
    });

export default getWeb3;