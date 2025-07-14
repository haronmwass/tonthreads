export interface Thread {
  id: string;
  title: string;
  description: string;
  category: string;
  memberCount: number;
  requiredPayment?: number; // in TON
  requiredNFT?: string; // NFT collection address
  telegramGroupId: string;
  createdAt: Date;
  isPrivate: boolean;
  image: string;
}

export interface User {
  wallet: string;
  nickname?: string;
  joinedThreads: string[];
  nfts: string[];
}

export interface JoinRequest {
  threadId: string;
  paymentTx?: string;
  nftProof?: string;
}