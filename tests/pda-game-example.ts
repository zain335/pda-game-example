import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { PdaGameExample as Game } from "../target/types/pda_game_example";
import { expect } from "chai";

describe("game", async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Game as Program<Game>;

  it("Sets and changes name!", async () => {
    const [userStatsPDA, _] = await PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("user-stats"),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    await program.methods
      .createUserStats("zain")
      .accounts({
        user: provider.wallet.publicKey,
        userStats: userStatsPDA,
      })
      .rpc();

    expect((await program.account.userStats.fetch(userStatsPDA)).name).to.equal(
      "brian"
    );

    await program.methods
      .changeUserName("ali")
      .accounts({
        user: provider.wallet.publicKey,
        userStats: userStatsPDA,
      })
      .rpc();

    expect((await program.account.userStats.fetch(userStatsPDA)).name).to.equal(
      "ali"
    );
  });
});
