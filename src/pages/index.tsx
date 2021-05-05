import { GetStaticProps } from "next";
import { api } from "../services/api";
import { format, parseISO } from "date-fns";
import ptBr from "date-fns/locale/pt-BR";
import { convertDurationToTimeString } from "../utils/covertDurationToTimeString";
import styles from "./home.module.scss";
import Image from "next/image";
import Link from "next/link";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
};

type HomeProps = {
  latestEpisodes: Array<Episode>;
  allEpisodes: Array<Episode>;
};

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map((ep) => {
            return (
              <li key={ep.id}>
                <Image
                  width={192}
                  height={192}
                  src={ep.thumbnail}
                  alt={ep.title}
                  objectFit="cover"
                />
                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${ep.id}`}>
                    <a>{ep.title}</a>
                  </Link>
                  <p>{ep.members}</p>
                  <span>{ep.publishedAt}</span>
                  <span>{ep.durationAsString}</span>
                </div>
                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>
        <table cellPadding={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th style={{ width: 120 }}>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((ep) => {
              return (
                <tr key={ep.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={ep.thumbnail}
                      alt={ep.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${ep.id}`}>
                      <a>{ep.title}</a>
                    </Link>
                  </td>
                  <td>{ep.members}</td>
                  <td>{ep.publishedAt}</td>
                  <td>{ep.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });
  const data = await response.data;

  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBr,
      }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
      url: episode.file.url,
    };
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);
  console.log(latestEpisodes);
  return {
    props: {
      allEpisodes,
      latestEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
