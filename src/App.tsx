import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

function App() {
  type Clima = {
    country: string;
    date: string;
    text: string;
    cached: boolean;
    execTime: string;
  };
  const [text, setText] = useState([""]);
  const [country, setCountry] = useState("");
  const [date, setDate] = useState("");
  const [execTime, setTime] = useState("");
  const [isCached, setCached] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const fetchApi = async () => {
    setLoading(true);
    await axios
      .get("https://climatempo-backend.onrender.com/clima")
      .then((response) => {
        const resData: Clima = response.data[0];
        const parsedText: string[] = resData.text.replaceAll(". ", ".. ").split(". ")
        setText(parsedText);
        setCached(resData.cached);
        setCountry(resData.country);
        setDate(resData.date);
        setTime(resData.execTime);
        setLoading(false);
        
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchApi();
  }, []);

  return (
    <div className="flex-1 text-center bg-gradient-to-tr from-stone-900 to-blue-950 items-center justify-center p-10 h-screen text-slate-300">
      <p className="text-3xl  align-middle mt-10">
        Previsão do clima + uso de cache Redis
      </p>
      <p className="text-md mb-7">
        Uso do Redis para "cachear" chamadas da API do Climatempo. Feito com
        Typescript, React.js, Node.js, Redis e TailwindCSS.
      </p>
      {isLoading && (
        <div className="flex w-full justify-center text-center">
          <svg
            className="animate-spin mt-40 h-10 w-10 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
      {!isLoading && (
        <div className="text-center justify-center">
          <div className="flex flex-auto gap-2 justify-center">
            <h4 className="text-xl  align-middle">{date}</h4>
            <h6 className="text-xl  align-middle">{`País: ${country}`}</h6>
          </div>
          <h6 className="text-xl  align-middle">{`Tempo de execução: ${Number(execTime).toFixed(2)}ms`}</h6>
          <h6 className="text-xl align-middle mb-7">{`Cache sendo usado? ${
            isCached ? "Sim" : "Não"
          }`}</h6>

          <div className="mx-24">
            {text.map((phrase) => <p className="text-2xl font-medium align-middle">{phrase}</p>)}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
