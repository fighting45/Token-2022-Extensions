import {
    createInitializeMintInstruction,
    createInitializeTransferFeeConfigInstruction,
    ExtensionType,
    getMintLen,
    TOKEN_2022_PROGRAM_ID,
    transferChecked
} from '@solana/spl-token';
import {
    Connection,
    clusterApiUrl,
    Keypair,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction

} from '@solana/web3.js';

import 'dotenv/config';
import bs58 from 'bs58';


(async () => {
    const connection = new Connection(clusterApiUrl('devnet'));
    const secretKey = bs58.decode(process.env.PRIVATE_KEY);
    const payer = Keypair.fromSecretKey(secretKey);
    const mintKeypair = Keypair.generate();
    const mint = mintKeypair.publicKey;
    const extensions = [ExtensionType.TransferFeeConfig];
    const mintLen = getMintLen(extensions);
    const mintLamports = await connection.getMinimumBalanceForRentExemption(mintLen);



    const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            //Public key of the created account 
            newAccountPubkey: mint,
            // Amount of lamports to transfer to the created account 
            lamports: mintLamports,
            // Amount of space in bytes to allocate to the created account 
            space: mintLen,
            // Public key of the program to assign as the owner of the created account 
            programId: TOKEN_2022_PROGRAM_ID

        }),
        createInitializeTransferFeeConfigInstruction(
            mint,
            payer.publicKey,
            payer.publicKey,
            50,
            BigInt(5_000),
            TOKEN_2022_PROGRAM_ID
        ),
        createInitializeMintInstruction(
            mint,
            9,
            payer.publicKey,
            payer.publicKey,
            TOKEN_2022_PROGRAM_ID
        ));

    transaction.feePayer = payer.publicKey;
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.sign(payer);
    transaction.sign(mintKeypair);

    const sig = await connection.sendTransaction(transaction, [payer, mintKeypair]);

    console.log(`The tx hash is ${sig}`);
})();

