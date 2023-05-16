import { BsCashCoin, BsSafeFill } from "react-icons/bs";
import { GiBank, GiWallet } from "react-icons/gi";
import { match } from "ts-pattern";
import AccountType from "~/refs/AccountType";

export const getAccountIcon = (accountType: AccountType) => {
  return match(accountType)
    .with(AccountType.Cash, () => <BsCashCoin />)
    .with(AccountType.Safe, () => <BsSafeFill />)
    .with(AccountType.Wallet, () => <GiWallet />)
    .with(AccountType.Bank, () => <GiBank />)
    .otherwise(() => <BsCashCoin />);
};
