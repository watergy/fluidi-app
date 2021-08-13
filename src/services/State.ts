import Gun from "gun";
import iris from "iris-lib";

const State: any = {
  init(publicOpts: any) {
    Gun.log.off = true;
    const o = Object.assign(
      {
        peers: ["http://localhost:8765/gun"],
        localStorage: false,
        retry: Infinity,
      },
      publicOpts
    );
    this.public = Gun(o);
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
