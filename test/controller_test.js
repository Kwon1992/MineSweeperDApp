const GameController = artifacts.require("GameController");
// test할 contract를 가져온다.

// https://web3js.readthedocs.io/en/v1.2.1/ :: 최신 web3
// truffle에서 test하기에는 보통 Mocha나 Chai가 있다.
// contract와 web3 통신법...? ==> transaction reciept를 이용한다.


/*
 요구사항?? => Test Case 이용.
*/


/*
Unit Testing Complete 
   (a. GameStart Function) 
      a-1. bet token amount correctly
      a-2. bet token amount incorrectly
      a-3. sufficient token balance
      a-4. insufficient token balance
   (b. get Token Balances Function) - 2 Token Balances
      b-1. buy Magnet & get Magnet token balance
      b-2. buy MagnetField & get MagnetField token balance
   (c. get Total Game Count Function) - Increase Correctly
      c-1. check total game count increase correctly
   (d. get UserInfo Function)
      d-1. check registered user's information.
      d-2. check unregistered user's information.
   (e. buy Items Function) - 1 Item / 2 Items / 3 Items
      e-1. check MagnetField token decrease correctly
      e-2. test when buy only 1 item.
      e-3. test when buy 2 items.
      e-4. test when buy all items.
      e-5. check unable to buy itmes when user has insufficient MagnetField Balance.
   (f. get Game Result Function) - Recent 5 Games
      f-1. check get recent game history correctly.
      f-2. less than 5 games
   (g. reward User Function) - WIN / LOSE
      g-1. when win the game.
      g-2. when lose the game.

   ** 토큰 교환
   추가할 test
   h. token test
    h-1. buy Magnet Token
    h-2. exchange MagnetField to Magnet
    
*/


// Mocha 형식 사용!
contract('GameController', function([deployer, user1, user2]) {
    // deployer, user1, user2에는 Account 주소가 각각 들어간다.
    // ganache-cli를 켜놓은 경우에는 deployer에는 0번 주소 / user1에는 1번 주소 / user2에는 2번 주소가 들어감 
    // ganache-cli를 켜놓은 경우에는 최대 10개의 Account가 있으므로, parameter로 10개까지 가능....

    let controller;
    let betAmountCorrect = 10 ;
    let betAmountIncorrent = 12;

    beforeEach(async () => {
        controller = await GameController.new();
    });


    // TEST #1) interact to Controller.startGame function
    // function startGame(bytes2 _difficulty, uint8 _gameCost, bytes32 _gameHex, bool[3] memory _useItem)
    describe('startGame function checking', function() {
        it('check start func perform correct', async () => {
            // console.log(web3.utils.asciiToHex('EZ'));
            // console.log(web3.utils.asciiToHex('0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1547'));
            // problem #1 : ERR.... startGame is not a function. (WHY? : access modifier was 'private' -> change modifier to public)
            // problem #2 ) 'EZ' is not a bytes2... (convert NEEDED -> solution web3.utils.asciiToHex() // fromAscii -> deprecated)
            // == SOLVED!! ==
            await controller.buyMagnet({from:user1, value:10000000000000000, gas:300000});
            await controller.startGame(web3.utils.fromAscii('EZ'), betAmountCorrect, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1547', [false,false,false], {from:user1});
        })
         
        it('check start func perform incorrect', async () => {
            await controller.startGame(web3.utils.fromAscii('EZ'), betAmountIncorrent, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1547', [false,false,false], {from:user1});
        })
    });

    // TEST #2) 
    describe('View Token Balance', () => {
        // == SOLVED!! ==
        it('Manget Tokens Balance', async () => {
            await controller.buyMagnet({from:user1, value:10000000000000000, gas:300000});
            let magnet = await controller.getMagnetBalance({from:user1});
            console.log(parseInt(magnet));
        });
    
        it('MangetField Tokens Balance', async () => {
            await controller.buyMagnetField({from:user1});
            let magnetF = await controller.getMagnetFieldBalance({from:user1});
            console.log(parseInt(magnetF));
        })
        
    });
    
    // TEST #3) 
    // gameStart한 경우 user의 totalGameCount가 정상적으로 증가하는지 테스트.
    // problem #1: 정상적으로 상승하지 않음...
    // == SOLVED!! ==
    describe('Check gameCount increase correctly', () => {
        it('game start', async () => {
            let gameCount = -1;
            
            await controller.getTotalGameCount({from:user1}).then( (res) => {
                gameCount = res;
            });
            console.log(`before game count: ${gameCount}`);

            await controller.buyMagnet({from:user1, value:50000000000000000, gas:300000});
            
            await controller.startGame(web3.utils.fromAscii('EZ'), betAmountCorrect, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1546', [false,false,false], {from:user1})
            await controller.startGame(web3.utils.fromAscii('EZ'), betAmountCorrect, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1546', [false,false,false], {from:user1})
            await controller.startGame(web3.utils.fromAscii('EZ'), betAmountCorrect, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1546', [false,false,false], {from:user1})
            await controller.startGame(web3.utils.fromAscii('EZ'), betAmountCorrect, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1546', [false,false,false], {from:user1})
            await controller.startGame(web3.utils.fromAscii('EZ'), betAmountCorrect, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1546', [false,false,false], {from:user1})
            
            
            await controller.getTotalGameCount({from:user1}).then( (res) => {
                gameCount = res;
            });
            console.log(`after game count: ${gameCount}`);
            assert.equal(gameCount, 5, "Not Increase properly");

        })
        
    });

    // TEST #4) 
    // userInfo를 불러오기
    // == SOLVED!! ==
    describe('Check get TotalGameCount correctly', () => {
        it('registered User', async() => {
            await controller.buyMagnet({from:user1, value:10000000000000000, gas:300000});
            await controller.startGame(web3.utils.fromAscii('EZ'), betAmountCorrect, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1546', [false,false,false], {from:user1})

            let user1Info;
            await controller.getTotalGameCount({from:user1}).then(
                (res) => { // res == txn receipt!
                    user1Info = res;
                }
            );

            console.log(user1Info._totalGameCount);
            assert.equal(user1Info._totalGameCount, 1, "totalGameCount NOT MATCH");
        })

        it('unregistered User', async() => {
            let user2Info;
            await controller.getTotalGameCount({from:user2}).then(
                (res) => {
                    user2Info = res;
                }
            );
            console.log(user2Info._totalGameCount);
            assert.equal(user2Info._totalGameCount, 0x0, "[message]");
        })
    });
    

    // TEST #5) 
    // Item 구매하기
    // == SOLVED!! == :정상적으로 토큰 감소됨.
    describe('Buy Items', () => {
        it('item buy when token is sufficient', async() => {
            let user1MFBalance = 0;
            await controller.buyMagnetField({from:user1});
            await controller.getMagnetFieldBalance({from:user1}).then((res)=>{
                user1MFBalance = res;
                console.log(user1MFBalance.toString());

            });
            await controller.useItems([true, true, true],{from:user1}).then((res) => {
                console.log("**********Item Buy Complete***********");
            });
            await controller.getMagnetFieldBalance({from:user1}).then((res)=>{
                user1MFBalance = res;
                console.log(user1MFBalance.toString());

            });

            // await controller.useItems([false, true, false],{from:user1}).then((res) => {
            //     console.log(res);
            // });
            // await controller.useItems([false, false, true],{from:user1}).then((res) => {
            //     console.log(res);
            // });
            // await controller.useItems([true, true, false],{from:user1}).then((res) => {
            //     console.log(res);
            // });
            // await controller.useItems([true, false, true],{from:user1}).then((res) => {
            //     console.log(res);
            // });
            // await controller.useItems([false, true, true],{from:user1}).then((res) => {
            //     console.log(res);
            // });
            // await controller.useItems([true, true, true],{from:user1}).then((res) => {
            //     console.log(res);
            // });
            // await controller.getMagnetFieldBalance({from:user1}).then((res)=>{
            //     user1MFBalance = res;
            //     console.log(user1MFBalance.toString());

            // });
        });

        it('item buy when token is unsufficient', async() => {
            await controller.useItems([true, false, false],{from:user2}).then((res) => {
                console.log("******************************************************");
            });            
        });
    });

    // TEST #6) 
    // 게임결과 가져오기 
    // == SOLVED!! ==
    describe('Get Game Results', () => {
        it('GET RECENT 5', async () =>  {

            await controller.buyMagnet({from:user1, value:60000000000000000, gas:300000});
            
            await controller.startGame(web3.utils.fromAscii('EZ'), betAmountCorrect, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1546', [false,false,false], {from:user1});
            await controller.startGame(web3.utils.fromAscii('NM'), betAmountCorrect, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1546', [false,false,false], {from:user1});
            await controller.startGame(web3.utils.fromAscii('HD'), betAmountCorrect, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1546', [false,false,false], {from:user1});

            let totalGameCount;
            let resultRecords = [];

            await controller.getTotalGameCount({from:user1}).then((res) => {
                totalGameCount = res;
            });            

            console.log('before loop');
            console.log(resultRecords);

            while(totalGameCount > totalGameCount-1 && totalGameCount > 0) {
                console.log(totalGameCount);
                await controller.getGameResults(totalGameCount, {from:user1}).then((res) => {
                    resultRecords.unshift(res);
                });
                totalGameCount--;
            }
            console.log('after loop');

            console.log(resultRecords);
        });
    });

    // TEST #7) 
    // 게임결과에 따른 보상주기
    // == SOLVED!! ==
    describe('Reward Users', () => {
        it('WIN', async () => {
            let magnetBalance;
            let magnetFieldBalance;

            await controller.buyMagnet({from:user1, value:30000000000000000});
            
            await controller.getMagnetBalance({from:user1}).then((res) =>{
                magnetBalance = res;
            })

            await controller.getMagnetFieldBalance({from:user1}).then((res) =>{
                magnetFieldBalance = res;
            })

            console.log(`before win the EZ game`);
            console.log(parseInt(magnetBalance));
            console.log(parseInt(magnetFieldBalance));
            await controller.startGame(web3.utils.fromAscii('EZ'), betAmountCorrect, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1546', [false,false,false], {from:user1})
            await controller.endGame('0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1546',true, user1, {from:deployer});
            await controller.getMagnetBalance({from:user1}).then((res) =>{
                magnetBalance = res;
            })

            await controller.getMagnetFieldBalance({from:user1}).then((res) =>{
                magnetFieldBalance = res;
            })
            console.log(`after win the EZ game (also before win the NM game)`);
            console.log(parseInt(magnetBalance));
            console.log(parseInt(magnetFieldBalance));

            await controller.startGame(web3.utils.fromAscii('NM'), betAmountCorrect, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1547', [false,false,false], {from:user1})
            await controller.endGame('0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1547',true, user1, {from:deployer});
            await controller.getMagnetBalance({from:user1}).then((res) =>{
                magnetBalance = res;
            })

            await controller.getMagnetFieldBalance({from:user1}).then((res) =>{
                magnetFieldBalance = res;
            })
            console.log(`after win the NM game (also before win the HD game)`);
            console.log(parseInt(magnetBalance));
            console.log(parseInt(magnetFieldBalance));

            await controller.startGame(web3.utils.fromAscii('HD'), betAmountCorrect, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1548', [false,false,false], {from:user1})
            await controller.endGame('0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1548',true, user1, {from:deployer});
            await controller.getMagnetBalance({from:user1}).then((res) =>{
                magnetBalance = res;
            })

            await controller.getMagnetFieldBalance({from:user1}).then((res) =>{
                magnetFieldBalance = res;
            })
            console.log(`after win the HD game`);
            console.log(parseInt(magnetBalance));
            console.log(parseInt(magnetFieldBalance));
        });

        it('LOSE', async () => {
            let magnetBalance;
            let magnetFieldBalance;

            await controller.buyMagnet({from:user1, value:30000000000000000, gas:300000});
            
            await controller.getMagnetBalance({from:user1}).then((res) =>{
                magnetBalance = res;
            })

            await controller.getMagnetFieldBalance({from:user1}).then((res) =>{
                magnetFieldBalance = res;
            })

            console.log(`before lose the EZ game`);
            console.log(parseInt(magnetBalance));
            console.log(parseInt(magnetFieldBalance));

            await controller.startGame(web3.utils.fromAscii('EZ'), betAmountCorrect, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1549', [false,false,false], {from:user1})
            await controller.endGame('0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1549',false, user1, {from:deployer});
            await controller.getMagnetBalance({from:user1}).then((res) =>{
                magnetBalance = res;
            })

            await controller.getMagnetFieldBalance({from:user1}).then((res) =>{
                magnetFieldBalance = res;
            })

            console.log(`after lose the EZ game (also before lose the NM game)`);
            console.log(parseInt(magnetBalance));
            console.log(parseInt(magnetFieldBalance));

            await controller.startGame(web3.utils.fromAscii('NM'), betAmountCorrect, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1548', [false,false,false], {from:user1})
            await controller.endGame('0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1548',false, user1, {from:deployer});
            await controller.getMagnetBalance({from:user1}).then((res) =>{
                magnetBalance = res;
            })

            await controller.getMagnetFieldBalance({from:user1}).then((res) =>{
                magnetFieldBalance = res;
            })

            console.log(`after lose the NM game (also before lose HD game)`);
            console.log(parseInt(magnetBalance));
            console.log(parseInt(magnetFieldBalance));

            await controller.startGame(web3.utils.fromAscii('HD'), betAmountCorrect, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1547', [false,false,false], {from:user1})
            await controller.endGame('0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1547',false, user1, {from:deployer});
            await controller.getMagnetBalance({from:user1}).then((res) =>{
                magnetBalance = res;
            })

            await controller.getMagnetFieldBalance({from:user1}).then((res) =>{
                magnetFieldBalance = res;
            })

            console.log(`after lose the HD game`);
            console.log(parseInt(magnetBalance));
            console.log(parseInt(magnetFieldBalance));
        });

        it('NOT MATCH GAMEHEX', async () => {
            await controller.buyMagnet({from:user1, value:10000000000000000, gas:300000});
            await controller.startGame(web3.utils.fromAscii('EZ'), betAmountCorrect, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1549', [false,false,false], {from:user1});
            await controller.endGame('0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1544',false, user1, {from:deployer});
        })

        it('NO USER', async () => {
            await controller.buyMagnet({from:user1, value:10000000000000000, gas:300000});
            await controller.startGame(web3.utils.fromAscii('EZ'), betAmountCorrect, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1549', [false,false,false], {from:user1});
            await controller.endGame('0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1549',false, user2, {from:deployer});
        })

        it('Request Reward from unauthorized User', async() => {
            await controller.buyMagnet({from:user1, value:10000000000000000, gas:500000});
            await controller.buyMagnet({from:user2, value:10000000000000000, gas:500000});
            await controller.startGame(web3.utils.fromAscii('EZ'), betAmountCorrect, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1549', [false,false,false], {from:user1});
            await controller.startGame(web3.utils.fromAscii('EZ'), betAmountCorrect, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1540', [false,false,false], {from:user2});
            await controller.endGame('0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1549',true, user1, {from:user1});
        })
    })

    // TEST #8)
    // 최소수량 조건을 충족 시 토큰 교환 가능 확인
    // 최소수량 조건을 미충족 시 토큰 교환 불가능 확인
    // 최소수량 조건을 충족한 토큰 교환 요청을 했으나 계좌의 토큰 잔량이 부족한 경우 교환 불가능 확인
    describe('exchange MagnetField to Magnet', () => {
        it('when user own more than 50000 MagnetField', async () => {
            let magnetBalance;
            let magnetFieldBalance;
            await controller.buyMagnetField({from:user1});
            magnetBalance = await controller.getMagnetBalance({from:user1});
            magnetFieldBalance = await controller.getMagnetFieldBalance({from:user1});
            
            console.log(`before exchange MagnetField to Manget (Magnet Balance): ${parseInt(magnetBalance)}`)
            console.log(`before exchange MagnetField to Manget (MagnetField Balance): ${parseInt(magnetFieldBalance)}`)
            await controller.exchangeTokens(60000, {from:user1});
            magnetBalance = await controller.getMagnetBalance({from:user1});
            magnetFieldBalance = await controller.getMagnetFieldBalance({from:user1});

            console.log(`after exchange MagnetField to Manget (Magnet Balance): ${parseInt(magnetBalance)}`)
            console.log(`after exchange MagnetField to Manget (MagnetField Balance): ${parseInt(magnetFieldBalance)}`)
        })

        it('when user own less than 50000 MagnetField', async () => {
            let magnetBalance;
            let magnetFieldBalance;
            await controller.buyMagnetField({from:user1});
            await controller.buyMagnet({from:user1, value:10000000000000000, gas:500000});
            await controller.startGame(web3.utils.fromAscii('EZ'), betAmountCorrect, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1547', [true,true,true], {from:user1});
            
            magnetBalance = await controller.getMagnetBalance({from:user1});
            magnetFieldBalance = await controller.getMagnetFieldBalance({from:user1});
            
            console.log(`before exchange MagnetField to Manget (Magnet Balance): ${parseInt(magnetBalance)}`)
            console.log(`before exchange MagnetField to Manget (MagnetField Balance): ${parseInt(magnetFieldBalance)}`)
            await controller.exchangeTokens(30000, {from:user1});
            magnetBalance = await controller.getMagnetBalance({from:user1});
            magnetFieldBalance = await controller.getMagnetFieldBalance({from:user1});
        })

        it.only('when balance is less than 50000 MagnetField', async () => {
            let magnetBalance;
            let magnetFieldBalance;
            await controller.buyMagnetField({from:user1});
            await controller.buyMagnet({from:user1, value:10000000000000000, gas:500000});
            await controller.startGame(web3.utils.fromAscii('EZ'), betAmountCorrect, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1547', [true,true,true], {from:user1});
            
            magnetBalance = await controller.getMagnetBalance({from:user1});
            magnetFieldBalance = await controller.getMagnetFieldBalance({from:user1});
            
            console.log(`before exchange MagnetField to Manget (Magnet Balance): ${parseInt(magnetBalance)}`)
            console.log(`before exchange MagnetField to Manget (MagnetField Balance): ${parseInt(magnetFieldBalance)}`)
            await controller.exchangeTokens(50000, {from:user1});
            magnetBalance = await controller.getMagnetBalance({from:user1});
            magnetFieldBalance = await controller.getMagnetFieldBalance({from:user1});
        })
    })
})
