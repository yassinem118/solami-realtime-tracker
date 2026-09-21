// Solami Blur API & gRPC Stream Client Configuration

export interface SolamiEvent {
  txHash: string;
  dexPool: string;
  eventType: "Swap" | "Liquidity_add" | "Liquidity_remove";
  volume: number;
  status: string;
  timestamp?: number;
}

export interface SolamiWalletQueryResponse {
  address: string;
  solBalance: number;
  tokenAccountsCount: number;
  isIndexed: boolean;
}

export class SolamiClient {
  private apiKey: string;
  private grpcEndpoint: string;

  constructor(apiKey: string = "solami_blur_demo_key", grpcEndpoint: string = "https://grpc.mainnet.solana.com") {
    this.apiKey = apiKey;
    this.grpcEndpoint = grpcEndpoint;
  }

  // Fetch indexed account & balance data via Solami Data API
  public async queryAccount(walletAddress: string): Promise<SolamiWalletQueryResponse> {
    if (!walletAddress || walletAddress.trim().length < 32) {
      throw new Error("Invalid Solana wallet address format.");
    }

    try {
      // Mocking Solami Data API Response for testing
      return {
        address: walletAddress,
        solBalance: parseFloat((Math.random() * 50 + 1.5).toFixed(3)),
        tokenAccountsCount: Math.floor(Math.random() * 12) + 1,
        isIndexed: true,
      };
    } catch {
      throw new Error(`Failed to query Solami Data API: ${this.apiKey} at ${this.grpcEndpoint}`);
    }
  }

  // Mock initial stream events payload for fallback/hydration
  public getInitialEvents(): SolamiEvent[] {
    return [
      {
        txHash: "5KjP8xLZ9mQ8vX1z234567890abcdef1234567890",
        dexPool: "Raydium CPMM / SOL",
        eventType: "Swap",
        volume: 3.42,
        status: "Landed (gRPC)",
        timestamp: Date.now() - 10000,
      },
      {
        txHash: "3MvW1qRK7pL9uY2z345678901abcdef1234567890",
        dexPool: "Meteora DLMM / SOL",
        eventType: "Liquidity_add",
        volume: 12.5,
        status: "Landed (gRPC)",
        timestamp: Date.now() - 25000,
      },
      {
        txHash: "2NhX7pTY4kM0tW3z45678902abcdef1234567890",
        dexPool: "Orca Whirlpool / SOL",
        eventType: "Swap",
        volume: 0.85,
        status: "Landed (gRPC)",
        timestamp: Date.now() - 40000,
      },
    ];
  }
}

export const solamiClient = new SolamiClient();