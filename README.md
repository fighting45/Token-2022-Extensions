# 🧬 Token-2022-Extensions

This repository contains modular Solana scripts demonstrating how to utilize **Token-2022** extensions using the `@solana/spl-token` JavaScript SDK. These extensions offer advanced token behaviors not available in the original SPL Token program.

Each script initializes a specific token extension or feature such as:

* ✅ Mint Close Authority
* 💸 Transfer Fee Configuration
* 🧊 Default Frozen Accounts
* 🔒 Immutable Owner (coming soon or handled in future updates)

> ⚠️ All scripts are tested on **devnet** and require a valid Solana wallet with some SOL balance.

---

## 📁 Directory Structure

```
Token-2022-Extensions/
├── mint-close-authority.js
├── transfer-fee.js
├── default-freeze.js
└── (optional) immutable-owner.js
```

---

## 🔧 Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/Token-2022-Extensions.git
   cd Token-2022-Extensions
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` file**
   Add your base58-encoded private key:

   ```
   PRIVATE_KEY=your_base58_secret_key
   ```

4. **Run any script**
   Example:

   ```bash
   node mint-close-authority.js
   ```

---

## 📜 Script Descriptions

### 1. `mint-close-authority.js`

Adds the `MintCloseAuthority` extension to allow closing the mint in the future. This extension **must be initialized before the mint itself**.

* Uses:

  * `createInitializeMintCloseAuthorityInstruction`
  * `createInitializeMintInstruction`

---

### 2. `transfer-fee.js`

Applies the `TransferFeeConfig` extension, enabling fee deduction on each transfer.

* Parameters:

  * Fee Basis Points: `50` (0.5%)
  * Max Fee: `5_000` (in base units, i.e., lamports)

* Uses:

  * `createInitializeTransferFeeConfigInstruction`
  * `createInitializeMintInstruction`

---

### 3. `default-freeze.js`

Initializes the mint with `DefaultAccountState` set to `Frozen`, meaning all token accounts will be frozen by default until explicitly thawed.

* Uses:

  * `createInitializeDefaultAccountStateInstruction`
  * `createInitializeMintInstruction`

* Optional Follow-up:

  * You can later update the default state using `updateDefaultAccountState()` if needed.

---

### 4. `immutable-owner.js` (planned/future)

This section is reserved for implementing accounts with immutable ownership, where the owner cannot be changed after creation.

---

## 🧪 Requirements

* Node.js `v16+`
* `@solana/web3.js`
* `@solana/spl-token` (ensure support for Token-2022 extensions)
* Environment variable with a funded wallet

---

## 📌 Notes

* These scripts are designed to **demonstrate core concepts** and are not production-hardened.
* Token-2022 is a separate program and **requires explicit usage of `TOKEN_2022_PROGRAM_ID`**.
* Don't forget to check for rent-exemption lamports using `getMinimumBalanceForRentExemption()` for each extension.

---

## 📚 References

* [Token-2022 Documentation](https://spl.solana.com/token-2022)
* [Solana SPL Token JS Docs](https://github.com/solana-labs/solana-program-library/tree/master/token/js)

---

## 👨‍💻 Author

Usama Hassan — [@fighting45](https://github.com/fighting45)

---
