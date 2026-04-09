import Electrobun, { Electroview } from "electrobun/view";
import { PdfRPC } from "../types/rpcType";

const rpc = Electroview.defineRPC<PdfRPC>({
  maxRequestTime: 30000,
  handlers: {
    requests: {},
    messages: {},
  },
});

export const electrobun = new Electrobun.Electroview({ rpc });
