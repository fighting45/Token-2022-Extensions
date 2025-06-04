import {
    clusterApiUrl,
    Connection,
    Transaction,
    Keypair,
    SystemProgram,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import { AccountState, createInitializeDefaultAccountStateInstruction, createInitializeMintInstruction, ExtensionType, getMintLen, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import bs58 from 'bs58';
import 'dotenv/config';

(async () => {
    const connection = new Connection(clusterApiUrl('devnet'));
    const payer = Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY));
    // console.log(secretKey);
    const mintKeypair = Keypair.generate();
    const mint = mintKeypair.publicKey;
    const extensions = [ExtensionType.DefaultAccountState];
    const defaultState = AccountState.Frozen;
    const mintLen = getMintLen(extensions);
    const mintLamports = await connection.getMinimumBalanceForRentExemption(mintLen);

    const transaction = new Transaction().add(
        SystemProgram.createAccount({
            /** The account that will transfer lamports to the created account */
            fromPubkey: payer.publicKey,
            /** Public key of the created account */
            newAccountPubkey: mint,
            /** Amount of lamports to transfer to the created account */
            lamports: mintLamports,
            /** Amount of space in bytes to allocate to the created account */
            space: mintLen,
            /** Public key of the program to assign as the owner of the created account */
            programId: TOKEN_2022_PROGRAM_ID
        }),
        createInitializeDefaultAccountStateInstruction(
            mint,
            defaultState,
            TOKEN_2022_PROGRAM_ID
        ),
        createInitializeMintInstruction(
            mint,
            9,
            payer.publicKey,
            payer.publicKey,
            TOKEN_2022_PROGRAM_ID
        )
    );


    const sig = await sendAndConfirmTransaction(connection, transaction, [payer, mintKeypair]);
    console.log(sig);

    //sendAndConfirmTransaction is more of all in one 

})();



// Over time, if the mint creator decides to 
// relax this restriction, the freeze authority may 
// sign an update_default_account_state instruction
//  to make all accounts unfrozen by default.


//     await updateDefaultAccountState(
//     connection,
//     payer,
//     mint,
//     AccountState.Initialized,
//     freezeAuthority,
//     [],
//     undefined,
//     TOKEN_2022_PROGRAM_ID
// );