const MultisigWallet = artifacts.require("MultisigWallet");

contract("MultisigWallet", (accounts) => {
  const [owner1, owner2, owner3, nonOwner] = accounts;
  let wallet;

  beforeEach(async () => {
    wallet = await MultisigWallet.new([owner1, owner2, owner3], 2);
  });

  it("should allow owner to submit transaction", async () => {
    const tx = await wallet.submitTransaction(nonOwner, 0, "0x0", { from: owner1 });
    assert.equal(tx.logs[0].event, "SubmitTransaction");
  });

  it("should allow owners to confirm and execute transaction", async () => {
    const txId = await wallet.submitTransaction(nonOwner, 0, "0x0", { from: owner1 }).then(tx => tx.logs[0].args.txId);
    await wallet.confirmTransaction(txId, { from: owner1 });
    await wallet.confirmTransaction(txId, { from: owner2 });
    await wallet.executeTransaction(txId, { from: owner1 });

    const txDetails = await wallet.getTransaction(txId);
    assert.equal(txDetails.executed, true);
  });

  it("should not allow non-owner to confirm", async () => {
    const txId = await wallet.submitTransaction(nonOwner, 0, "0x0", { from: owner1 }).then(tx => tx.logs[0].args.txId);
    try {
      await wallet.confirmTransaction(txId, { from: nonOwner });
      assert.fail("Expected error not received");
    } catch (err) {
      assert.include(err.message, "Not an owner");
    }
  });
});