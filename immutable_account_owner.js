
import {
    clusterApiUrl,
    Connection,
    Transaction,
    Keypair,
    SystemProgram,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import { AccountState, createInitializeAccountInstruction, createInitializeDefaultAccountStateInstruction, createInitializeImmutableOwnerInstruction, createInitializeMintInstruction, createMint, ExtensionType, getAccountLen, getMintLen, TOKEN_2022_PROGRAM_ID, createAccount } from '@solana/spl-token';
import bs58 from 'bs58';
import 'dotenv/config';

(async () => {
    const connection = new Connection(clusterApiUrl('devnet'));
    const payer = Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY));
    // console.log(secretKey);

    const mint = await createMint(
        connection,
        payer,
        payer.publicKey,
        payer.publicKey,
        9,
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID
    )
    console.log(mint);
    const extensions = [ExtensionType.ImmutableOwner];
    const accLen = getAccountLen(extensions);
    const accLamports = await connection.getMinimumBalanceForRentExemption(accLen);

    const accountKeypair = Keypair.generate();
    const account = accountKeypair.publicKey;

    const transaction = new Transaction().add(
        SystemProgram.createAccount({
            /** The account that will transfer lamports to the created account */
            fromPubkey: payer.publicKey,
            /** Public key of the created account */
            newAccountPubkey: account,
            /** Amount of lamports to transfer to the created account */
            lamports: accLamports,
            /** Amount of space in bytes to allocate to the created account */
            space: accLen,
            /** Public key of the program to assign as the owner of the created account */
            programId: TOKEN_2022_PROGRAM_ID
        }),
        createInitializeImmutableOwnerInstruction(
            account,
            TOKEN_2022_PROGRAM_ID
        )
        ,
        createInitializeAccountInstruction(
            account,
            mint,
            payer.publicKey,
            TOKEN_2022_PROGRAM_ID
        )
    );
    const sig = await sendAndConfirmTransaction(connection, transaction, [payer, accountKeypair]);
    console.log(sig);

})();

