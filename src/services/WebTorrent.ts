import WebTorrent from "webtorrent";

interface ITorrentMachine {
  init: (opts: WebTorrent.Options) => void;
  client?: WebTorrent.Instance;
}

const TorrentMachine: ITorrentMachine = {
  init(opts: WebTorrent.Options) {
    this.client = new WebTorrent(opts);
  },
};

export default TorrentMachine;
