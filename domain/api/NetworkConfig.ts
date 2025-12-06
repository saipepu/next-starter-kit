class NetworkConfig {
  private static instance: NetworkConfig;

  private constructor() {}

  static get shared(): NetworkConfig {
    if (!NetworkConfig.instance) {
      NetworkConfig.instance = new NetworkConfig();
    }
    return NetworkConfig.instance;
  }

  public baseURL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "API URL cannot be found";
}

export default NetworkConfig;
