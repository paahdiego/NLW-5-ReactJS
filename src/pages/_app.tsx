import { Header } from "../components/Header";
import { Player } from "../components/Player";

import "../styles/global.scss";
import styles from "../styles/app.module.scss";
import { PlayerContext } from "../contexts/PlayerContext";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setcurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function play(episode) {
    setEpisodeList([episode]);
    setcurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function tooglePlay() {
    setIsPlaying(!isPlaying);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(!state);
  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList: episodeList,
        currentEpisodeIndex: currentEpisodeIndex,
        play: play,
        isPlaying: isPlaying,
        togglePlay: tooglePlay,
        setPlayingState: setPlayingState,
      }}
    >
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  );
}
export default MyApp;
