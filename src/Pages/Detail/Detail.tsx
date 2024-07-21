import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

//typagem
import { CoinsProps } from "../Home/Home";

//css
import styles from "./Detail.module.css";

export function Detail() {
  const { cripto } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState<CoinsProps>();
  const [loading, setLoading] = useState(true);

  interface PropsCripto {
    data: CoinsProps;
  }

  interface ErrorData {
    error: string;
  }

  type DataProps = PropsCripto | ErrorData;

  useEffect(() => {
    async function getCoins() {
      try {
        fetch(`https://api.coincap.io/v2/assets/${cripto}`)
          .then((response) => response.json())
          .then((response: DataProps) => {
            if ("error" in response) {
              navigate("/");
              return;
            }

            const price = Intl.NumberFormat("en-US", {
              //formatar moedas  normal
              style: "currency",
              currency: "USD",
            });

            const priceCaompacted = Intl.NumberFormat("en-US", {
              //formatar moedas compactado
              style: "currency",
              currency: "USD",
              notation: "compact",
            });

            const result = {
              ...response.data,
              formatedPrice: price.format(Number(response.data.priceUsd)),
              formatedMarket: priceCaompacted.format(
                Number(response.data.marketCapUsd)
              ),
              formatVolume: priceCaompacted.format(
                Number(response.data.volumeUsd24Hr)
              ),
            };

            setCoin(result);
            setLoading(false);
          });
      } catch (error) {
        console.log(error);
        navigate("/");
      }
    }

    getCoins();
  }, [cripto]);

  if (loading || !coin) {
    return (
      <div className={styles.container}>
        <h1 className={styles.center}>Carregando detalhes...</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.center}>{coin?.name}</h1>
      <h1 className={styles.center}>{coin?.symbol}</h1>

      <section className={styles.content}>
        <img
          src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLocaleLowerCase()}@2x.png`}
          alt="Logo cripto moeda"
          className={styles.logo}
        />
        <h1>
          {coin?.name} | {coin?.symbol}
        </h1>
        <a>
          <strong>Preço: </strong>
          {coin?.formatedPrice}
        </a>
        <a>
          <strong>Mercado: </strong>
          {coin?.formatedMarket}
        </a>
        <a>
          <strong>Volume: </strong>
          {coin?.formatVolume}
        </a>
        <a>
          <strong>Mudança 24h: </strong>{" "}
          <span
            className={
              Number(coin?.changePercent24Hr) > 0 ? styles.profit : styles.loss
            }
          >
            {Number(coin?.changePercent24Hr).toFixed(3)}
          </span>
        </a>
      </section>
    </div>
  );
}
