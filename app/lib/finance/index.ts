// https://query1.finance.yahoo.com/v8/finance/chart/EURUSD=X?region=US&lang=en-US&includePrePost=false&interval=2m&useYfid=true&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance
import { mande } from "mande";
import type CurrencyEnum from "~/refs/CurrencyEnum";

export class FinanceApi {
  api: any;

  protected cache: Record<string, any> = {};

  constructor() {
    this.api = mande("https://query1.finance.yahoo.com/v8/finance");
  }

  async getExchangeRate(from: CurrencyEnum, to: CurrencyEnum) {
    if (this.cache[`${from}${to}`]) {
      return this.cache[`${from}${to}`];
    }

    const response = await this.api.get(`/chart/${from}${to}=X`, {
      region: "US",
      lang: "en-US",
      includePrePost: false,
      interval: "2m",
      useYfid: true,
      range: "1d",
      corsDomain: "finance.yahoo.com",
      ".tsrc": "finance",
    });

    this.cache[`${from}${to}`] =
      response.chart.result[0].meta.regularMarketPrice;

    return response.chart.result[0].meta.regularMarketPrice;
  }
}

export default FinanceApi;
