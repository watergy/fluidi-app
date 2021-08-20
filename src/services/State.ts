import Gun from "gun";
import { IGunChainReference } from "gun/types/chain";
import iris from "iris-lib";

interface IState {
  init: (publicOpts: any) => void;
  public: IGunChainReference;
  local: IGunChainReference;
}

// @ts-ignore
const State: IState = {
  init(publicOpts: any) {
    Gun.log.off = true;
    const o = Object.assign(
      {
        peers: ["https://gun-manhattan.herokuapp.com/gun"],
        localStorage: false,
        retry: Infinity,
      },
      publicOpts
    );
    this.public = Gun(o);
    // @ts-ignore
    this.local = Gun({
      peers: [],
      file: "State.local",
      multicast: false,
      localStorage: false,
    }).get("state");

    (window as any).State = this;
    iris.util.setPublicState && iris.util.setPublicState(this.public);
  },
};

export default State;
