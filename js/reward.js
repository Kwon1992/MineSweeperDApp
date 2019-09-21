const AdministratorAddr = "0xe373EF98F258c966c4e27cDcbB072Abeb1a5da07";
const contractAddr = "0x6F467E5A03c5b10Bf8Ab9EFB02D93f6D1DA25C06";

var privateKey = "2D039C476F4DE4839D8DCE5C75B7DEEA1EF8499D573792A525850FA925D521F2";


function reward(gameSHA, isWinner) {

    web3.eth.getTransactionCount(AdministratorAddr, function (err, nonce) {

        var data = gameController.endGame.getData(gameSHA, isWinner, accountAddr);

        var tx = new ethereumjs.Tx({
          nonce: web3.toHex(nonce),
          gasPrice: web3.toHex(web3.toWei('20', 'gwei')),
          gasLimit: web3.toHex(3000000),
          to: contractAddr,
          value: web3.toHex(0),
          data: data
        });

        tx.sign(ethereumjs.Buffer.Buffer.from(privateKey, 'hex'));


        var raw = '0x' + tx.serialize().toString('hex');
        
        web3.eth.sendRawTransaction(raw, {from:AdministratorAddr}, function (err, transactionHash) {
            if(err){
            } else if(transactionHash != undefined || transactionHash != null) { 
                runCodeForAllCells(function(cell) { 
                    if (!cell.isBomb && cell.flagged) {
                    var td = document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`); 
                    td.innerHTML = wrongBombImage; 
                    }
                });
                document.getElementById('hashValue').innerHTML = transactionHash;
                $('#myModal').delay(5000).show(0);
            }
        });
    });
}






