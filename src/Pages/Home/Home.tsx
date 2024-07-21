//react
import { FormEvent, useEffect, useState } from "react";

import styles from "./Home.module.css";
//routers
import { Link, useNavigate } from "react-router-dom";

//icons
import { BsSearch } from "react-icons/bs";

//tipagem
export interface CoinsProps {
  changePercent24Hr: string;
  explorer: string;
  id: string;
  marketCapUsd: string;
  maxSupply: string;
  name: string;
  priceUsd: string;
  rank: string;
  supply: string;
  symbol: string;
  volumeUsd24Hr: string;
  vwap24Hr: string;
  formatedPrice?: string;
  formatedMarket?: string;
  formatVolume?: string;
}

interface DataProps {
  data: CoinsProps[];
}

export function Home() {
  const [input, setInput] = useState("");
  const [coins, setCoins] = useState<CoinsProps[]>([]);
  const [carregarMoedas, setCarregarMoedas] = useState<number>(5);

  useEffect(() => {
    getData();
  }, [carregarMoedas]);

  async function getData() {
    fetch(`https://api.coincap.io/v2/assets?limit=${carregarMoedas}&offset=0`)
      .then((response) => response.json())
      .then((json: DataProps) => {
        const coinsData = json.data;

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

        const formatedResult = coinsData.map((item) => {
          //adicionar um item seu no array do API recebido
          const formated = {
            ...item,
            formatedPrice: price.format(Number(item.priceUsd)),
            formatedMarket: priceCaompacted.format(Number(item.marketCapUsd)),
            formatVolume: priceCaompacted.format(Number(item.volumeUsd24Hr)),
          };

          return formated;
        });

        // console.log(formatedResult);
        setCoins(formatedResult);
      });
  }

  const navigate = useNavigate();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (input === "") return;

    navigate(`/detail/${input.toLowerCase()}`);
  }

  function handleGetMore() {
    let acumulador = Number(coins.length);
    setCarregarMoedas(Number(acumulador) + 5);
  }

  function handleGetLess() {
    if (carregarMoedas < 5) {
      return;
    } else {
      let acumulador = Number(coins.length);
      setCarregarMoedas(Number(acumulador) - 5);
    }
  }

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite o nome da moeda... Ex: bitcoin"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">
          <BsSearch size={30} color="#fff" />
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope="col">Modela</th>
            <th scope="col">Valor mercado</th>
            <th scope="col">Preço</th>
            <th scope="col">Volume</th>
            <th scope="col">Mudança 24h</th>
          </tr>
        </thead>

        <tbody id="tbody">
          {coins.length > 0 &&
            coins.map((item) => (
              <tr className={styles.tr} key={item.id}>
                <td className={styles.tdLabel} data-Label="Modela">
                  <div className={styles.nome}>
                    <Link to={`/detail/${item.id}`}>
                      <img
                        className={styles.logo}
                        src={`https://assets.coincap.io/assets/icons/${item.symbol.toLocaleLowerCase()}@2x.png`}
                        alt="Logo da cripto"
                      />
                    </Link>
                    <Link to={`/detail/${item.id}`}>
                      <span>{item.name}</span> | {item.symbol}
                    </Link>
                  </div>
                </td>
                <td className={styles.tdLabel} data-Label="Valor mercado">
                  {item.formatedMarket}
                </td>
                <td className={styles.tdLabel} data-Label="Preço">
                  {item.formatedPrice}
                </td>
                <td className={styles.tdLabel} data-Label="Volume">
                  {item.formatVolume}
                </td>
                <td
                  className={
                    Number(item.changePercent24Hr) > 0
                      ? styles.tdProfit
                      : styles.tdLoss
                  }
                  data-Label="Mudança 24h"
                >
                  <span>{Number(item.changePercent24Hr).toFixed(3)}</span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <button className={styles.buttonMore} onClick={handleGetMore}>
        Carregar mais...
      </button>
      {carregarMoedas > 6 ? (
        <button className={styles.buttonMore} onClick={handleGetLess}>
          Carregar menos...
        </button>
      ) : (
        ""
      )}
    </main>
  );
}
